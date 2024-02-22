/*
 * @Author: sunyue
 * @Date: 2023-09-11 09:18:50
 * @LastEditors: sunyue
 * @LastEditTime: 2023-09-11 10:45:40
 * @Description: 描述
 * Copyright (c) 2023 by 中国科学院软件研究所, All Rights Reserved. 
 */
const requestMethod = ['post', 'get', 'delete', 'put', 'patch', 'options', 'head']

function createTagsByPath(paths) {
    const res = Object.keys(paths).map((key) => {
        const path = paths[key];
        let item;
        for (let i = 0; i < requestMethod.length; i++) {
            if(path[requestMethod[i]]) {
                item = path[requestMethod[i]];
                break;
            }
        }
        return item.tags[0]
    })
    return [...new Set(res)]
}

module.exports = createTagsByPath