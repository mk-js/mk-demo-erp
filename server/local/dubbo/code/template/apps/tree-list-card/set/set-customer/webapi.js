/**
 * webapi.js 封装app所需的所有web请求
 * 供app测试使用，app加入网站后webpai应该由网站通过config,提供给每个app
 */


import { fetch } from 'mk-utils'
import config from './config'

export default {
    customer: {
        query: (option) => fetch.post(config.current.webapiMap['customer.query'], option),
        
        findById: (id) => fetch.post(config.current.webapiMap['customer.findById'], { id }),
        create: (option) => fetch.post(config.current.webapiMap['customer.create'], {
            ...option,
            customerGroupId: option.customerGroup && option.customerGroup.id
        }),
        update: (option) => fetch.post(config.current.webapiMap['customer.update'], {
            ...option,
            customerGroupId: option.customerGroup && option.customerGroup.id
        }),
    },
    customerGroup: {
        queryTree: (option) => fetch.post(config.current.webapiMap['customerGroup.queryTree'], option),
    }
}