/*
 * @Author: sunyue
 * @Date: 2023-08-31 17:06:16
 * @LastEditors: sunyue
 * @LastEditTime: 2023-09-01 16:32:50
 * @Description: 描述
 * Copyright (c) 2023 by 中国科学院软件研究所, All Rights Reserved. 
 */
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
