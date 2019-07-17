export default {
    component: 'div',
    className: 'voucher sys-entity',
    children: [{
        component: 'div',
        className: 'voucher-header',
        children: [{
            component: 'div',
            className: 'voucher-header-left',
            children: [{
                component: 'antd.Button.Group',
                children: [{
                    component: 'antd.Button',
                    className: 'icon-button-softly',
                    icon: 'left',
                    title: '上一张',
                    onClick: '{{$prev}}'
                }, {
                    component: 'antd.Button',
                    className: 'icon-button-softly',
                    icon: 'right',
                    title: '下一张',
                    onClick: '{{$next}}'
                }]
            }]
        }, {
            component: 'div',
            className: 'voucher-header-center'
        }, {
            component: 'div',
            className: 'voucher-header-right',
            children: [
                { component: 'antd.Button', className: 'button-showy', onClick: '{{$genCode}}', children: '下载代码' },
                { component: 'antd.Button', className: 'button-showy', onClick: '{{$save}}', children: '保存' },
                { component: 'antd.Button', className: 'button-bluesky', onClick: '{{$add}}', children: '新增' },
            ]
        }]
    }, {
        component: 'tpl.Form',
        className: 'voucher-form',
        children: [
            { type: 'select', title: '所属组', bindPath: 'data.form.entityGroup', required: true, onLoadOption: '{{$loadEntityGroup}}', titleGetter: '{{(v)=> v && v.code}}', displayGetter: `{{(v)=> v && '(' + v.code + ')' + v.name}}` },
            { type: 'input', title: '编码', bindPath: 'data.form.code', required: true },    
            { type: 'input', title: '名称', bindPath: 'data.form.name', required: true },   
            { type: 'input', title: '表名', bindPath: 'data.form.tableName', required: true }, 
        ]
    }, {
        component: 'tpl.Table',
        bindPath: 'data.form.fields',
        enablePagination: false,
        columns: [
            { type: 'sequence' },
            { type: 'addAndDel', onHeaderAddRow: '{{$headerAddRow}}', onAddRow: '{{$addRow(row.rowIndex)}}', onDelRow: '{{$delRow(row.rowIndex)}}' },
            { type: 'text', title: '编码', bindField: 'code', required: true, fixed: true, flexGrow: 1 },
            { type: 'text', title: '名称', bindField: 'name', width: 100, fixed: true, flexGrow: 1 },
            { type: 'select', title: '类型', bindField: 'typeName', required: true, onLoadOption: '{{$loadTypeNames}}', titleGetter: '{{(v)=> v && v.code || v}}', displayGetter: `{{(v)=> v && '(' + v.code + ')' + v.name}}` },
            { type: 'text', title: '参数', bindField: 'options', width: 100, flexGrow: 1 },
            { type: 'text', title: '备注', bindField: 'description', width: 150, flexGrow: 1 }, ]
    }]
}