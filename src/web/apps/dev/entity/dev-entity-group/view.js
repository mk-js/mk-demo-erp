export default {
    component: 'div',
    className: 'simple-modal-card dev-entity-group',
    children: {
        component: 'tpl.Form',
        children: [
            { type: 'input', title: '上级实体组', disabled: true, bindPath: 'data.form.parent.name'},
            { type: 'input', title: '编码', required: true, bindPath: 'data.form.code' },
            { type: 'input', title: '名称', required: true, bindPath: 'data.form.name' },
            { type: 'input', title: '描述', required: true, bindPath: 'data.form.description' },
            { component: 'antd.Button', children: '保存', onClick: '{{$save}}', _visible: false}
        ]
    }
}