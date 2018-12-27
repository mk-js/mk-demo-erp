import { fetch, getAction } from 'maka'

const moment = getAction('moment')

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.entityGroups) {
        mockData.entityGroups = [{
            id: 0,
            code: 'CG001',
            name: '北京实体'
        }]
    }

    if (!mockData.entitys) {
        mockData.entitys = []
        for (let i = 0; i < 200; i++) {
            mockData.entitys.push({
                id: i,
                code: 'CUSTOMER' + (i + 1),
                name: '实体' + (i + 1),
                entityGroup: mockData.entityGroups[0]
            })
        }
    }
}

fetch.mock('/v1/sys/entity/group/queryAll', (option) => {
    initMockData()
    return {
        result: true,
        value: mockData.entityGroups
    }
})



fetch.mock('/v1/sys/entity/query', (option) => {
    initMockData()
    const { pagination, filter } = option

    var data = mockData.entitys
    if (filter) {
        if (filter.search)
            data = data.filter(o => o.name.indexOf(filter.search) != -1)
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
})


fetch.mock('/v1/sys/entity/delete', (option) => {
    initMockData()
    option.entitys.forEach(entity => {
        let index = mockData.entitys.findIndex(o => o.id == entity.id)

        if (index || index === 0)
            mockData.entitys.splice(index, 1)
    })

    return { result: true, value: true }
})



fetch.mock('/v1/sys/entity/group/del', (option) => {
    initMockData()

    let index = mockData.entityGroups.findIndex(o => o.id == option.id)

    if (index || index === 0)
        mockData.entityGroups.splice(index, 1)

    return { result: true, value: true }
})
