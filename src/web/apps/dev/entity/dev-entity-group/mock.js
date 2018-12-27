import { fetch } from 'maka'

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.entityGroups) {
        mockData.entityGroups = [{
            id: 0,
            code: 'CG001',
            name: '北京实体'
        }]
    }
}

fetch.mock('/v1/sys/entity/group/findById', (option) => {
    initMockData()
    const o = mockData.entityGroups.find(o => o.id == option.id)

    if(o.parentId || o.parentId == 0){
        var parent = mockData.entityGroups.find(p => p.id == o.parentId)
        o.parent = {id: parent.id, code: parent.code, name: parent.name}
    }
    return {
        result: true,
        value: o
    }
})

fetch.mock('/v1/sys/entity/group/create', (option) => {
    initMockData()

    const id = mockData.entityGroups.length
    const v = { ...option, id }
    if(option.parent){
        v.parentId = option.parent.id
        delete v.parent 
    }
    
    console.log(v)
    mockData.entityGroups.push(v)

    return { result: true, value: v }
})

fetch.mock('/v1/sys/entity/group/update', (option) => {
    initMockData()
    var index = mockData.entityGroups.findIndex(o => o.id == option.id)
    mockData.entityGroups[index] = option
    return { result: true, value: option }
})
