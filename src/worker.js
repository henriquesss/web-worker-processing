import Service from "./service"

const service = new Service()
postMessage({ eventType: 'alive' })  

onmessage = ({ data }) => {
    const { query, file } = data

    service.processFile({
        query,
        file,
        onCurrenceUpdate: (args) => {
            postMessage({ eventType: 'ocurrenceUpdate', ...args })    
        },
        onprogress: (total) => { postMessage({ eventType: 'progress', total }) }
    })
    
    console.log('hey from worker')
}