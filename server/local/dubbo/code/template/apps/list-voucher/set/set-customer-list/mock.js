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

    if(!mockData.persons){
        if (!mockData.persons) {
            mockData.persons = []
            for (let i = 0; i < 200; i++) {
                mockData.persons.push({
                    id: i,
                    name: '诸葛' + (i + 1),
                    sex: i % 2 + '',
                    birthday: `1980-${i % 11 + 1}-${i % 28 + 1}`,
                    mobile: '13818181' + (100 + i),
                    department: 101,
                    address: '北京海淀'
                })
            }
        }
    }

}

fetch.mock('/v1/person/init', (option) => {
    initMockData()

    var ret = query(option)
    ret.value.departments = mockData.departments
    return ret
})



function query(option) {
    const { pagination, filter } = option

    var data = mockData.persons

    if (filter) {
        if (filter.departmentId) {
            data = data.filter(o => {
                if (!o.department)
                    return true
                let departmentId = o.departmentId + ''
                return departmentId.substr(0, filter.department.toString().length) == filter.department
            })
        }

        if (filter.search) {
            data = data.filter(o => o.name.indexOf(filter.search) != -1
                || o.mobile.indexOf(filter.search) != -1)
        }


    }


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

    return ret
}

fetch.mock('/v1/person/del', (option) => {
    initMockData()
    option.ids.forEach(id => {
        let index = mockData.persons.findIndex(o => o.id == id)

        if (index || index === 0)
            mockData.persons.splice(index, 1)
    })

    return { result: true, value: true }
})

fetch.mock('/v1/department/del', (option) => {
    initMockData()
    const del = (types) => {
        types.forEach((t, index) => {
            if (t.id == option.id) {
                types.splice(index, 1)
                return true
            } else if (t.children) {
                del(t.children)
            }
        })
    }
    del(mockData.departments)

    return { result: true, value: true }
})

