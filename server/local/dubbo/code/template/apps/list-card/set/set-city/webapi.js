/**
 * webapi.js 封装app所需的所有web请求
 * 供app测试使用，app加入网站后webpai应该由网站通过config,提供给每个app
 */


import { fetch } from 'mk-utils'
import config from './config'
export default {
    city: {
        findById: (id) => fetch.post(config.current.webapiMap['city.findById'], { id }),
        create: (option) => fetch.post(config.current.webapiMap['city.create'], option),
        update: (option) => fetch.post(config.current.webapiMap['city.update'], option),
    },
}