/**
 * webapi.js 封装app所需的所有web请求
 * 供app测试使用，app加入网站后webpai应该由网站通过config,提供给每个app
 */


import { fetch } from 'mk-utils'
import config from './config'


export default {
    city: {
        query: (option) => fetch.post(config.current.webapiMap['city.query'], option),
        queryPageList: (option) => fetch.post(config.current.webapiMap['city.queryPageList'], option),
        del: (option) => fetch.post(config.current.webapiMap['city.del'], option)
    }
}