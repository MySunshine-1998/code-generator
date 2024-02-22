### 说明

1. 目前支持参数中使用Object类型( 多参数仍在开发中 )，例如： 

   ```JavaScript
   httpRequest({ url: '', data: {} })
   ```

2. 使用方法：

   1. 安装s-swagger-auto-api

      ```JavaScript
      npm install s-swagger-auto-api -D
      ```

   2. 在项目跟目录创建autoApiConfig.js

      ```JavaScript
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
      ```

   3. 增加快捷指令（非必须，只是为了方便，也可以在控制台执行 cd node_modules/s-swagger-auto-api && node index.js）

      ```JavaScript
      在package.json中增加
      "scripts": {
          "createapi": "node node_modules/s-swagger-auto-api index.js"
      }
      ```

   4. 执行npm run createapi命令代码会在src/api目录中生成



### 注意事项

定义autoApiConfig.js的template时需要使用模板字符串，否则路径中的参数不会变成动态变量



### 运行环境要求

node版本 >14



### 关于代码提示

目前只使用了vscode，所以以下情况只针对vscode。

vscode如果想出现代码提示，不能解构对象，例如：

```javascript
import { edit } from "./虚拟机信息管理"

edit() //这样是没有提示的
```

我使用的方法如下，如果有其他更好的方式也可以分享一下

```javascript
import * as test from './虚拟机信息管理'

test.default.deleteVirtualMachines() //vscode会出现description以及参数名称
```

