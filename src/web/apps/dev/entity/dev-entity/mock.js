import { fetch, getAction } from 'maka'

const moment = getAction('moment')

const mockData = fetch.mockData

function initMockData() {
    if (!mockData.materiels) {
        mockData.materiels = [{
            id: 1,
            code: 'M001',
            name: '物料1',
            spec: '规格1',
            prop: '属性1',
            uom: {
                name: '个'
            }
        }, {
            id: 2,
            code: 'M002',
            name: '物料2',
            spec: '规格2',
            prop: '属性2',
            uom: {
                name: '件'
            }
        }]
    }

    if (!mockData.technics) {
        mockData.technics = [{
            id: 1,
            code: 'T001',
            name: '工艺1',
        }, {
            id: 2,
            code: 'T002',
            name: '工艺2',
        }]
    }

    if (!mockData.technicDetails) {
        mockData.technicDetails = [{
            id: 1,
            technicId: 1,
            code: 'TD001',
            name: '工艺1工序1',
        }, {
            id: 2,
            technicId: 1,
            code: 'T002',
            name: '工艺1工序2',
        }, {
            id: 1,
            technicId: 2,
            code: 'TD003',
            name: '工艺2工序1',
        }, {
            id: 2,
            technicId: 2,
            code: 'T004',
            name: '工艺2工序2',
        }]
    }

    if (!mockData.entitys) {
        mockData.entitys = [{
            id: 0,
            code: '001',
            materiel: mockData.materiels[0],
            technic: mockData.technics[0],
            amount: 1,
            yield: 100,
            status: { id: 2, name: '未使用' },
            details: [{
                id: 1,
                materiel: mockData.materiels[0],
                amount: 1,
                lossRate: 0,
                technicDetail: mockData.technicDetails[0]
            }]
        }]
    }
}

fetch.mock('/v1/sys/entity/findById', (option) => {
    initMockData()

    const entity = mockData.entitys.find(o => o.id == option.id)
    
    return {
        result: true,
        value: entity
    }
})


fetch.mock('/v1/sys/entity/prev', (option) => {
    initMockData()

    if(mockData.entitys.length == 0){
        return {
            result: false,
            error: { message: '已经是首页' }
        }
    }

    var index = 0 

    if( option.id || option.id == 0) 
        index =  mockData.entitys.findIndex(o => o.id == option.id)
    else
        index = mockData.entitys.length 

    if(index == 0){
        return {
            result: false,
            error: { message: '已经是首页' }
        }
    }
    
    return {
        result: true,
        value: mockData.entitys[index-1]
    }
})

fetch.mock('/v1/sys/entity/next', (option) => {
    initMockData()

    if(mockData.entitys.length == 0){
        return {
            result: false,
            error: { message: '已经是末页' }
        }
    }

    var index = 0 

    if( option.id || option.id == 0) 
        index =  mockData.entitys.findIndex(o => o.id == option.id)
    else
        index = -1

    if(index == mockData.entitys.length -1){
        return {
            result: false,
            error: { message: '已经是末页' }
        }
    }
    
    return {
        result: true,
        value: mockData.entitys[index+1]
    }
})

fetch.mock('/v1/sys/entity/create', (option) => {
    initMockData()

    const id = mockData.entitys.length
    const v = { ...option, id }
    mockData.entitys.push(v)

    return { result: true, value: v }
})

fetch.mock('/v1/sys/entity/update', (option) => {
    initMockData()
    var index = mockData.entitys.findIndex(o => o.id == option.id)
    mockData.entitys[index] = option
    return { result: true, value: option }
})


fetch.mock('/v1/materiel/queryAll', (option) => {
    initMockData()
    return {
        result: true,
        value: mockData.materiels
    }
})

fetch.mock('/v1/technic/queryAll', (option) => {
    initMockData()
    return {
        result: true,
        value: mockData.technics
    }
})

fetch.mock('/v1/technic/detail/queryAll', (option) => {
    initMockData()

    var details = mockData.technicDetails.filter(o => o.technicId == option.technicId)
    return {
        result: true,
        value: details
    }
})


