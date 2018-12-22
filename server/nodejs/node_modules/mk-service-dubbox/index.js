/*
 *  index.js        //属性说明，导出的config方法在服务器启动时调用，api对象的下级方法绑定到对应的url，如: api.create 方法绑定的url是 "/company/create"
*/
const api = require("./api")

const index = {
    name: "dubbox",
    version: "",
    description: "",
    author: "lsg",
    apiRootUrl: "/",
    config,
    api,
}

module.exports = index;




/*
 *  config.js        //初始化参数设置
*/

function config(options) {
    var current = config.current
    Object.assign(current, options)
    if (!current.group) {
        current.group = undefined
    }
    api._init(current)
}
config.current = {
    application: {
        name: "mk-server"
    },
    discoveryInterfaces: [],
    register: "127.0.0.1:2181",
    dubboVer: "2.8.4",
    fileTypeName: '',
    parseToUTCTime: false,
    returnWithType: true,
    returnNullValue: false,
    errorTypeName:'com.rrtimes.rap.vo.BusinessException',
    group: '',
    timeout: 300000,
}
