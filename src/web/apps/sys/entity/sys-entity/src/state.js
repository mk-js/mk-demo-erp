export default {
    data: {
        form: { 
            fields: [{}]
        },
        other: {
            isChanged: false,
            typeNames: [{
                code: 'String',
                name: '字符'
            }, {
                code: 'Integer',
                name: '整数'
            }, {
                code: 'Double',
                name: '小数'
            }, {
                code: 'Date',
                name: '日期'
            }, {
                code: 'Long',
                name: 'Id'
            }, {
                code: 'Timestamp',
                name: 'Ts'
            }, {
                code: 'DTO',
                name: '引用'
            }, {
                code: 'LIST',
                name: '子表'
            }], 
        }
    }
}