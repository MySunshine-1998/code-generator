/*
 * @Author: sunyue
 * @Date: 2023-09-07 15:06:01
 * @LastEditors: sunyue
 * @LastEditTime: 2023-09-22 16:20:00
 * @Description: 描述
 * Copyright (c) 2023 by 中国科学院软件研究所, All Rights Reserved. 
 */
const { parse, visit } = require('recast')
const path = require('path');
const fs = require('fs');

const dirPath = path.join(process.cwd(), 'src/api/')


const mergeTemplate = function(tag, paths) {
    let oldPaths = [];
    try {
        const words = fs.readFileSync(dirPath + tag + '.js');
        // 如果之前存在过同名文件则对比是否出现过同函数名，最后生成的文件只包含之前文件中不存在的
        const oldAST = parse(words);
        visit(oldAST, {
            visitFunctionDeclaration(func) {
                const name = func.node.id.name;
                oldPaths.push(name)
                return false
            }
        })
    } catch (error) {
        console.log(error);
    }
    return oldPaths
}

module.exports = mergeTemplate
