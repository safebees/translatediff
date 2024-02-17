const fs = require('fs');
const MAIN_FILE = '/Users/mac/IdeaProjects/translatediff/test/test_de.json';
const BESIDE_FILES = [
    '/Users/mac/IdeaProjects/translatediff/test/test_en.json'
];
const UTF8 = 'utf8';

for (const besidefile of BESIDE_FILES) {
    const mainJson = JSON.parse(fs.readFileSync(MAIN_FILE, UTF8));
    const besideFile = JSON.parse(fs.readFileSync(besidefile, UTF8));
    const map = new Map();
    buildMap(besideFile, map);

    patch(mainJson, map)

    fs.writeFileSync(
        besidefile,
        JSON.stringify(mainJson, undefined, 2), UTF8);
}


function buildMap(obj, map, path = '') {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            buildMap(obj[key], map, `${path}${key}.`);
        } else {
            map.set(`${path}${key}`, `${obj[key]}`);
        }
    }
}

function patch(obj, originMap, path = '',) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            patch(obj[key], originMap, `${path}${key}.`);
        } else {
            let p = `${path}${key}`;
            let originValue = originMap.get(p);
            if (originValue === undefined) {
                obj[key] = 'todo translate - ' + obj[key];
                console.log('Added todo to ' + p)
            } else {
                obj[key] = originValue;
            }
        }
    }
}



