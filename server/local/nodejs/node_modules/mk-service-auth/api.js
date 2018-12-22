const jwt = require('jsonwebtoken');
let config

const api = {
    _init: (current) => {
        config = current
        config.apiRootUrl = current.server.apiRootUrl

        let array = config.server.interceptors || [];
        if (array.filter(a => a == interceptor) == 0) {
            array.push(interceptor)
        }
        config.server.interceptors = array
 
        let serverAuth = {
            custom: scheme
        }
        if (config.default) {
            serverAuth.default = config.default
        }
        config.server.auth = Object.assign(config.server.auth || {}, serverAuth)
    }
}

const scheme = (server, options) => ({
    api: {
        settings: config
    },
    authenticate: (request, reply) => {
        let ctx = { request, apiUrl: request.path }
        if (ctx.apiUrl.indexOf(config.apiRootUrl) != 0
            || ctx.request.headers['content-type'] == 'application/x-www-form-urlencoded'
        ) {
            return reply.continue({ credentials: {} });
        }

        let clientToken = ctx.request.headers.token 
        || ctx.request.headers.Authorization 
        || ctx.request.headers.authorization 
        || ctx.request.headers.authorization 
        || ctx.request.payload && ctx.request.payload.token 
        || ctx.request.url.query.token;

        try {
            ctx.token = decodeToken(clientToken);
        } catch (error) {
            let { excludeUrls, apiRootUrl } = config;
            if (excludeUrls["/*"] || excludeUrls[apiRootUrl + "/*"] || excludeUrls[ctx.apiUrl]) return reply.continue({ credentials: {} });

            reply(config.errorObj)
            return false;
        }
        return reply.continue({ credentials: ctx.token });
    }
})

function interceptor(ctx) {
    //向上下文中增加setToken方法和token对象。
    ctx.setToken = (obj) => {
        ctx.resBody.token = encodeToken(obj);
        return ctx;
    };
    ctx.token = ctx.request.auth.credentials;

    let clientToken = ctx.request.headers.token 
        || ctx.request.headers.Authorization 
        || ctx.request.headers.authorization 
        || ctx.request.headers.authorization 
        || ctx.request.payload && ctx.request.payload.token 
        || ctx.request.url.query.token;

    try {
        ctx.token = decodeToken(clientToken);
    } catch (error) {
        let { excludeUrls, apiRootUrl } = config; 
        if (excludeUrls["/*"] || excludeUrls[apiRootUrl + "/*"] || excludeUrls[ctx.apiUrl]) return true;

        ctx.error(config.errorObj);
        return false;
    }

    if (!ctx.token) {
        ctx.error(config.errorObj);
        return false
    }
    return true
}

function encodeToken(obj) {
    let { secret, expire, tokenKeys, claim } = config;
    let arr = [];

    claim = claim || {}
    Object.keys(claim).forEach((k)=>{
        claim[k] = obj[claim[k]]
    }) 

    if (!Array.isArray(obj) && Array.isArray(tokenKeys)) {
        tokenKeys.forEach((k, i) => arr[i] = obj[k])
    } else {
        arr = obj;
    }
    claim.sub = JSON.stringify(arr);
    claim.exp = Math.floor(Date.now() / 1000) + expire;
    
    let str = jwt.sign(claim, secret, { algorithm: 'HS512' });
    return str;
}

function decodeToken(str) {
    if (!str) throw ({ code: 10, message: "empty token" });
    let { secret, tokenKeys } = config;

    if(str.indexOf(' ')!=-1){
        str = str.substr(str.lastIndexOf(' ') + 1)
    }

    let json = jwt.verify(str, secret, { algorithms: ['HS512'] });
    let obj = JSON.parse(json.sub)
    let token = obj
    if (Array.isArray(obj) && Array.isArray(tokenKeys)) {
        token = {}
        tokenKeys.forEach((k, i) => token[k] = obj[i])
    }
    return token;
}

module.exports = api
