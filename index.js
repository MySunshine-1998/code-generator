/*
 * @Author: sunyue
 * @Date: 2023-08-28 13:21:37
 * @LastEditors: sunyue
 * @LastEditTime: 2023-09-25 16:44:16
 * @Description: 描述
 * Copyright (c) 2023 by 中国科学院软件研究所, All Rights Reserved. 
 */
const colors = require('colors');
const axios = require('axios');
const inquirer = require('inquirer');

let url;
try {
    url = require(process.cwd() + '/autoApiConfig.js').url;
} catch (error) {
    return;
}
const filePath = 'src\\api\\';

const getApiData = require('./lib/getApiData');
const getTags = require('./lib/getTags');
const getPaths = require('./lib/getPaths');
const createTemplate = require('./lib/createTemplate');
const writeDocument = require('./lib/writeDocument');
const mergeTemplate = require('./lib/mergeTemplate')
const createTagsByPath = require('./lib/createTagsByPath')


const main = async function() {
    const apiData = await getApiData(url);
    let { definitions, paths, tags, basePath } = apiData.data;
    if(!tags) tags = createTagsByPath(paths);
    const tag = await getTags(tags);
    const tagpaths = getPaths(tag, paths);
    const mergePaths = mergeTemplate(tag, tagpaths)
    const documentsWords = createTemplate(tagpaths.filter(path => !mergePaths.includes(path.functionName)), tag, mergePaths);
    writeDocument(documentsWords, tag);
    // console.log(tagpaths);
}

main();