/**
 * mock.js 提供应用截获ajax请求，为脱离后台测试使用
 * 模拟查询更改内存中mockData,并返回数据
 */

import { fetch } from 'mk-utils'

const mockData = fetch.mockData
function initMockData() {
    if (!mockData.departments){
        mockData.departments = [{
            id: 1,
            code: '001',
            name: '部门1',
            children:[{
                id:101,
                code: '00101',
                name: '部门101'
            },{
                id:102,
                code: '00102',
                name: '部门102'
            }]
        }, {
            id: 2,
            code: '002',
            name: '部门2',
        }, {
            id: 3,
            code: '003',
            name: '部门3',
        }]
    }
}

function findNode(id, nodes){
    for(let n of nodes){
        if(n.id == id){
            return n
        }
        else if(n.children){
            let t = findNode(id, n.children)
            if(t) return t
        }
    }
}

fetch.mock('/v1/department/findById', (option) => {
    initMockData()

    const node = findNode(option.id, mockData.departments)
    return { result: true, value: node }
})

fetch.mock('/v1/department/create', (option) => {
    initMockData()

    if(!option.parentId){
        const id = mockData.departments.length + 1
        const v = { ...option, id }
        mockData.departments.push(v)
    
        return { result: true, value: v }
    }


    const parent = findNode(option.parentId, mockData.departments)
    var newId = -1
    if (!parent.children) {
        parent.children = []
        newId = option.parentId * 100 + 1
    }
    else {
        newId = parent.children[parent.children.length - 1].id + 1
    }
    const v = { code: option.code, name: option.name, id: newId }
    parent.children.push(v)

    return { result: true, value: v }

  
})

fetch.mock('/v1/department/update', (option) => {
    initMockData()
    const node = findNode(option.id, mockData.departments)
    node.code = option.code
    node.name = option.name
    return { result: true, value: node }

})

