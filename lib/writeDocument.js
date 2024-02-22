const fs = require('fs');
const path = require('path');
function writeDocument(words, tag, importTemplate=`import { defHttp } from '@/utils/axios'`) {
    // console.log(process.cwd())
    const basePath = process.cwd();
    const directory = path.normalize(basePath + '/src/api');
    // // 确保目录存在
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    let compoleteWords = `${importTemplate}\n${words}`
    fs.writeFile(`${directory}/${tag}.js`, words, (err) => {
        console.log(err)
    })
}
module.exports = writeDocument;
