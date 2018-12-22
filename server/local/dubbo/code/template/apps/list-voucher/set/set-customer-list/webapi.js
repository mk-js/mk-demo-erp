/**
 * webapi.js 封装app所需的所有web请求
 * 供app测试使用，app加入网站后webpai应该由网站通过config,提供给每个app
 */


import { fetch } from 'mk-utils'
import config from './config'

export default {
    init: (option) => {
        var option = {
            'treeDs': [config.current.webapiMap['customerGroup.queryTree'],{}],
            'tableDs': [config.current.webapiMap['customer.queryPageList'],option]
        }
        return fetch.post('/v1/', option)
    },
    customer: {
        queryPageList: (option) => fetch.post(config.current.webapiMap['customer.queryPageList'], option),
        query: (option) => fetch.post(config.current.webapiMap['customer.query'], option),
        del: (option)  => fetch.post(config.current.webapiMap['customer.del'], option),
        delBatch: (option) => fetch.post(config.current.webapiMap['customer.delBatch'], option),
    },
    customerGroup: {
        query: (option) => fetch.post(config.current.webapiMap['customerGroup.query'], option),
        queryTree: (option) => fetch.post(config.current.webapiMap['customerGroup.queryTree'], option),
        del: (option)  => fetch.post(config.current.webapiMap['customerGroup.del'], option),
    }
}