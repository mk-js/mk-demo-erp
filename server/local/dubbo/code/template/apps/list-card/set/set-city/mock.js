/**
 * mock.js 提供应用截获ajax请求，为脱离后台测试使用
 * 模拟查询更改内存中mockData,并返回数据
 */

import { fetch } from 'mk-utils'

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.suppliers) {
        mockData.suppliers = []
        for (let i = 0; i < 5; i++) {
            mockData.suppliers.push({
                id: i,
                code: 'supplier' + (i + 1),
                name: '供应商' + (i + 1),
            })
        }
    }
}

fetch.mock('/v1/supplier/findById', (option) => {
    initMockData()

    const supplier = mockData.suppliers.find(o => o.id == option.id)
    
    return {
        result: true,
        value: supplier
    }
})

fetch.mock('/v1/supplier/create', (option) => {
    initMockData()

    const id = mockData.suppliers.length
    const v = { ...option, id }
    mockData.suppliers.push(v)

    return { result: true, value: v }
})

fetch.mock('/v1/supplier/update', (option) => {
    initMockData()
    mockData.suppliers[option.id] = option
    return { result: true, value: option }
})

