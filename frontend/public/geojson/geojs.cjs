const { get } = require('https');
const { writeFile } = require('fs/promises');
const { join } = require('path');

const fetch = code => new Promise((resolve, reject) => get(
    `https://geojson.cn/api/data/${code}.json`, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
}).on('error', reject));

const writeJSON = (path,_) => data => (_=JSON.parse(data), writeFile(join(__dirname, path), data).then(()=>_));

// fetch('china')
// .then(writeJSON('100000.json'))
// .then(async ({features})=>{
//     for(const {properties:{code}} of features.filter(({properties:{name}}) => name))
//         await fetch(code).then(writeJSON(`${code}.json`)).catch(e=>console.error(code, e));
// })

const list = {};
const push = code=>data=>list[code]=JSON.parse(data);
fetch('china').then(push(100000)).then(async ({features})=>{
    for(const {properties:{code}} of features.filter(({properties:{name,code}}) => name&&code&&code!=710000))
        await fetch(code).then(push(code)).catch(e=>console.error(code, e));
        console.debug('write')
    await writeFile(
        join(__dirname, './geo.json'),
        JSON.stringify(list)
    );
});