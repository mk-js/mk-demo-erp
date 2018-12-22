/**
 * mock.js 提供应用截获ajax请求，为脱离后台测试使用
 * 模拟查询更改内存中mockData,并返回数据
 */

import { fetch } from 'mk-utils'

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.customertypes) {
        mockData.customertypes = []
        for (let i = 0; i < 5; i++) {
            mockData.customertypes.push({
                id: i,
                code: 'customertype' + (i + 1),
                name: '客户' + (i + 1),
            })
        }
    }
}

fetch.mock('/v1/customertype/findById', (option) => {
    initMockData()

    const customertype = mockData.customertypes.find(o => o.id == option.id)
    
    return {
        result: true,
        value: customertype
    }
})

fetch.mock('/v1/customertype/create', (option) => {
    initMockData()

    const id = mockData.customertypes.length
    const v = { ...option, id }
    mockData.customertypes.push(v)

    return { result: true, value: v }
})

fetch.mock('/v1/customertype/update', (option) => {
    initMockData()
    mockData.customertypes[option.id] = option
    return { result: true, value: option }
})

