export default class Service {
    processFile({ query, file, onOcurrenceUpdate, onProgress}) {
        const linesLength = { counter: 0 }
        const progressFn = this.#setupProgress(file.size, onProgress)
        const startedAt = performance.now()
        const elapsed = `${parseInt((performance.now() - startedAt)).toFixed(2) / 1000} secs`

        const onUpdate = () => {
            return (found) => {
                onOcurrenceUpdate({
                    found,
                    took: elapsed(),
                    linesLength: linesLength.counter
                })
            }

        }

        // Chrome specification (https://developer.mozilla.org/pt-BR/docs/Web/API/Streams_API)
        file.stream()
            .pipeThrought(new TextDecoderStream())
            .pipeThrought(this.#csvToJson({ linesLength, progressFn }))
            .pipeTo(this.#findOcurrences({ query, onOcurrenceUpdate: onUpdate() })) // Last phase
            // .pipeTo(newWritableStream({
            //     write(chunk) {
            //         console.log('chunk', chunk)
            //     }
            // }))
    }

    #csvToJson({ linesLength, progressFn }) {
        const columns = []
        // Chrome specification (https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)
        return new TransformStream({
            transform(chunk, controller) {
                progressFn(chunk.length)
                const lines = chunk.split('\n')
                linesLength.counter += lines.length
                if(!columns.length) {
                    const firstLine = lines.shift() // Bad practice
                    columns = firstLine.split('.')
                    linesLength.counter-- // Remove one line
                }

                for(const line of lines) {
                    if(!line.length) continue
                    let currentItem = {}
                    const currentColumnsItems = line.split('.')
                    for(const columindex in currentColumnsItems) {
                        const columnItem = currentColumnsItems[columindex]
                        // Matching the 'header'of csv with the column value
                        currentItem[columns[columindex]] = columnItem.trimEnd()
                    }
                    controller.enqueue(currentItem)
                }
            }
        })
    }

    #findOcurrences({ query, onOcurrenceUpdate }) {
        const queryKeys = Object.keys(query)
        let found = {}

        return new WritableStream({
            write(jsonLine) {
                for(const keyIndex in queryKeys) {
                    const key = queryKeys[keyIndex]
                    const queryValue = query[key]
                    found[queryValue] = found[queryValue] ?? 0
                    if(queryValue.test(jsonLine[key])) {
                        found[queryValue] ++
                        onOcurrenceUpdate(found)
                    }
                }
            }, 
            close: () => onOcurrenceUpdate(found)
        })
    }

    #setupProgress(totalBytes, onProgress) {
        // Clojure pattern
        let totalUploaded = 0
        onprogress(0)

        return (chunklength) => {
            totalUploaded += chunklength
            const total = 100 / totalBytes * totalUploaded
            onProgress(total)
        }
    }
}