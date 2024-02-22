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