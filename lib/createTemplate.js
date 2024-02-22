/*
 * @Author: sunyue
 * @Date: 2023-08-28 16:44:55
 * @LastEditors: sunyue
 * @LastEditTime: 2023-09-27 17:40:18
 * @Description: 描述
 * Copyright (c) 2023 by 中国科学院软件研究所, All Rights Reserved. 
 */
// 把模板先转成AST, 组装好之后再变成Js代码，最后format
// 需要改变模板的描述和函数名，改变函数体中的method和url
// 还需要判断需不需要生成param

const { parse, print, visit } = require('recast');
const recast = require('recast');
const fs = require('fs');
const path = require('path');
const basicPath = path.join(process.cwd(), '/src/api/')
// 全部js代码
let documentation = [];

// 描述的AST
// [
//     {
//         type: 'Block',
//         value: '*\r\n' +
//             '   * @param {number[]} nums - 输入的整数数组\r\n' +
//             '   * @return {number[]} - 数组中的两个数，它们的和等于目标整数\r\n' +
//             '   ',
//         loc: {
//             start: [Object],
//             end: [Object],
//             lines: [Lines],
//             tokens: [Array],
//             indent: 2
//         },
//         leading: true,
//         trailing: false
//     }
// ]

const _ = require('lodash');
const templateConfig = require(process.cwd() + '/autoApiConfig.js')
function createTemplate(paths, tag, mergePaths) {
    const template = templateConfig.template.join('\n');
    console.log(template);
    const ast = parse(template);
    visit(ast, {
        visitFunctionDeclaration(func) {
            // 获取comments AST
            // let comments = func.node.comments;
            paths.forEach(path => {
                let newAstNode = _.cloneDeep(func.node);
                // 处理注释
                let newCommets = recast.types.builders.block(`*\n * @description: ${path.description}\n ${path.parameters?.map(param => `* @param {*} ${param.name} type: ${param.schema.type} required: ${param.required}\n`).join('') || '\n'} * @return {*}\n `, true, false);
                newAstNode['comments'] = [newCommets];
                // 处理param,先判断此请求是否有params
                // 获取params AST
                let paramAST = newAstNode.params[0];
                let newParams = path?.parameters?.map(param => {
                    let newParamAST = _.cloneDeep(paramAST);
                    newParamAST.name = param.name
                    return newParamAST
                }) || [];
                newAstNode.params = newParams;
                // 处理函数名
                // 目前只测出来如果函数名为delete为不合法 因为function delete为不合法函数命名，
                // 如果遇到operationId为delete的就改为delete+url除了参数之外最后一个斜杠之前的字符串
                newAstNode.id.name = path.functionName;
                // 处理函数体，主要是请求参数
                // 目前想到的有两种情况，一种是用对象将参数包裹起来例如{ url: '', method: '', data: {} }，另一种是直接传参例如httpRequest(method, url, data)
                const args = newAstNode.body.body[0].argument.arguments;
                const argsLength = args.length;
                // 有三种情况，一种是没有参数，一种是一个参数，一种是多个参数
                switch (argsLength) {
                    case 0:
                        newAstNode.body[0].argument.arguments = [];
                        break;
                    case 1:
                        args[0].properties.forEach(property => {
                            if (property.key.name == 'method') {
                                // 大小写这块之后看看要不要做成可配置的
                                property.value.raw = path.method;
                                property.value.value = path.method;
                            } else if (property.key.name == 'url') {
                                // property.value.raw = `${path.url}`;
                                // property.value.value = `${path.url}`;
                                const templateElement = property.value;
                                templateElement.quasis = [];
                                templateElement.expressions = [];
                                // 获取url中的变量
                                const varibleList = getVaribleListByUrl(path.url);
                                // 获取quasis
                                let quasisList;
                                if (varibleList) {
                                    quasisList = getQuasisListByUrl(path.url);
                                } else {
                                    quasisList = [path.url]
                                }
                                quasisList.forEach(v => {
                                    const tmp = recast.types.builders.templateElement({
                                        raw: v,
                                        cooked: v,
                                    }, true);
                                    templateElement.quasis.push(tmp);
                                })
                                varibleList && varibleList.forEach(q => {
                                    const tmp = recast.types.builders.identifier(q);;
                                    templateElement.expressions.push(tmp);
                                })
                                property.value = templateElement;

                                // 这地方是不是应该做活？
                            } else if (['data', 'params', 'param'].includes(property.key.name)) {
                                if (path.parameters && Array.isArray(path.parameters) && path.parameters.length > 0) {
                                    let newProperties = []
                                    path.parameters.forEach(pathParam => {
                                        let propertyAST = _.cloneDeep(property.value.properties[0])
                                        propertyAST.value.name = pathParam.name;
                                        propertyAST.key.name = pathParam.name;
                                        newProperties.push(propertyAST);
                                    })
                                    property.value.properties = newProperties;
                                } else {
                                    property.value.properties = []
                                }
                            }
                        });
                        break;
                    default:
                        // 先不处理参数展开情况
                        break;
                }
                documentation.push(_.cloneDeep(newAstNode));
            })
            return false
        }
    })
    return generatorImportTemplate() + '\r\n' + generator(documentation, tag) + '\r\n' + generatorExportTemplate(paths, mergePaths);
}

function generator(documentation, tag) {
    let res = '';
    try {
        const oldFileStr = fs.readFileSync(basicPath + tag + '.js').toString();
        const oldASTArr = [];
        const oldFileAST = parse(oldFileStr);
        if (!oldFileAST) return;
        visit(oldFileAST, {
            visitFunctionDeclaration: function (func) {
                oldASTArr.push(func.node)
                return false;
            }
        })
        oldASTArr.forEach(ast => {
            res += print(ast).code + '\r\n'
        })
    } catch (error) {
        console.log(error)
    }
    documentation.forEach(ast => {
        res += print(ast).code + '\r\n'
    })
    return res;
}

function generatorExportTemplate(paths, mergePaths) {
    return [
        'export default {',
        `${mergePaths.concat(paths.map(path => `   ` + path.functionName)).join(`\n`)}`,
        '}'
    ].join('\n')
}

function generatorImportTemplate() {
    return templateConfig.importTemplate;
}

function getVaribleListByUrl(url) {
    const regex = /{([^}]+)}/g;
    return url.match(regex)?.map(str => str.substring(1, str.length - 1))
}

function getQuasisListByUrl(url) {
    let splitArr = url.split('/{').map(item => item + '/');
    let res = [];
    res[0] = splitArr.shift();
    for (let index = 0; index < splitArr.length - 1; index++) {
        res.push('/')
    }
    res.push('');
    return res;
}
module.exports = createTemplate