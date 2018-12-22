/**
 * mock.js 提供应用截获ajax请求，为脱离后台测试使用
 * 模拟查询更改内存中mockData,并返回数据
 */

import { fetch } from 'mk-utils'
import moment from 'moment'

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.citys) {
        mockData.citys = []
        for (let i = 0; i < 5; i++) {
            mockData.citys.push({
                id: i,
                code: 'city'+ (i + 1),
                name: '城市' + (i + 1),
            })
        }
    }
}

fetch.mock('/v1/set/city/queryPageList', (option) => {
    initMockData()
    const { pagination, filter } = option

    var data = mockData.citys
    
    var current = pagination.current
    var pageSize = pagination.pageSize
    var start = (current - 1) * pageSize
    var end = current * pageSize

    start = start > data.length - 1 ? 0 : start
    end = start > data.length - 1 ? pageSize : end
    current = start > data.length - 1 ? 1 : current

    var ret = {
        result: true,
        value: {
            pagination: { current, pageSize, total: data.length },
            list: []
        }
    }
    for (let j = start; j < end; j++) {
        if (data[j])
            ret.value.list.push(data[j])
    }

    ret.value.list = ret.value.list.map(o => {
        return {
            ...o
        }
    })
    return ret
})

fetch.mock('/v1/set/city/delete', (option) => {
    initMockData()
    const {id, ts} = option
    let index = mockData.citys.findIndex(o => o.id == id)
    if (index || index === 0)
        mockData.citys.splice(index, 1)
    return { result: true, value: true }
})