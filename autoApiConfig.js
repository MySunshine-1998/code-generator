/*
 * @Author: sunyue
 * @Date: 2023-09-22 17:42:19
 * @LastEditors: sunyue
 * @LastEditTime: 2023-09-28 14:16:19
 * @Description: 描述
 * Copyright (c) 2023 by 中国科学院软件研究所, All Rights Reserved. 
 */
module.exports = {
    importTemplate: "import { testHttp } from '@/utils/axios'", //引入函数
    template: [ //代码模板
        '',
        'function preLogin(params) {',
        '    return testHttp.httpRequest({  method: "post", url: ``, data: {params} })',
        '}',
        ''
    ],
    url: 'http://192.168.33.22:15500/v3/api-docs' //后端swagger地址
}