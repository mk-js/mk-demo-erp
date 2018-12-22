/*
 *  index.js        //属性说明，导出的config方法在服务器启动时调用，api对象的下级方法绑定到对应的url，如: api.create 方法绑定的url是 "/company/create"
*/
const api = require("./api")

const index = {
    apiRootUrl: false,
    name: "auth",
    version: "",
    description: "",
    author: "lsg",
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

    current.apiRootUrl = options.server.apiRootUrl;
    if (options.key) {
        current.secret = new Buffer(options.key, "base64");
    }
    current.excludeUrls = {};
    if(current.exclude && current.exclude.forEach){
        current.exclude.forEach(i => current.excludeUrls[current.apiRootUrl + i] = true) 
    }

    api._init(current)
}
config.current = {
    apiRootUrl: "",
    errorObj: {
        code: '402',
        message: '未登录'
    },
    key: "token/key",
    tokenKeys: ["userId"],
    claim: {},
    exclude: [],
    secret: null,
    expire: 5 * 24 * 60 * 60, //5 days, seconds
}
