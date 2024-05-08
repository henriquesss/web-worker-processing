# Performance and multithreading on the Browser  

<img width="1439" alt="ew-processing" src="https://github.com/henriquesss/web-worker-processing/assets/20709402/d8f3d5ab-e099-44ef-bc29-c5df8352dc4a">

## Based on Erick's Wendel Tutorial
https://www.youtube.com/watch?v=-wXPxJYhZeI&list=WL&index=18

### Requirements
- nvm (to download the correct version of Node)
- csv asset to read and test stuff. You can use this one [Kagle](https://www.kaggle.com/datasets/foenix/slc-crime?select=SLC_Police_Calls_2013__2016_cleaned_geocoded.csv)

### Instalation
- git clone https://github.com/henriquesss/web-workers-at-browser
- nvm use
- npm run start

### Architecture
- `src/controller.js`= Intermediador/validador de recursos
- `src/index.js` = Centraliza tudo para ser importado pelo index.html
- `src/service.js` = Regras de negócio
- `src/view.js` = Operacoes de frontend
- `src/worker.js` = Operacoes nas threads do navegador

### Apprenticeship
- `cat database.csv | wc-l` (count the number of lines in a file)
- Work threads is paralels threads running with main
- Too much `console.log` can downgrade de software performance

### Todo
- [ ]  Improve UI of the project
- [ ]  Create a new layer with validations (middleware?)
- [ ]  Discover and use a good practice at `src/service.js`instead of `lines.shift()`
- [ ]  Use lib `csvtojson` instead of function at `src/service.js`
- [ ]  Fix the line numbers 

## Where i can use Workers?
https://caniuse.com/?search=worker
