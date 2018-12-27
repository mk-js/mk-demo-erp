import React from 'react'
import { actionMixin, fetch } from 'maka'
import initState from './state'

@actionMixin('base', 'moment', 'tableHelper', 'message', 'modal')
export default class action {
    constructor(option) {
        Object.assign(this, option.mixins)
        this.base.setState = this.setState(this.base.setState)
    }

    onInit = async () => {
        //设置监听tab关闭事件
        this.component.props.addTabCloseListener
            && this.component.props.addTabCloseListener(this.component.props.appFullName, this.tabClose)

        //设置监听tab激活事件
        this.component.props.addTabActiveListener
            && this.component.props.addTabActiveListener(this.component.props.appFullName, this.tabActive)

        if (this.component.props.entityId || this.component.props.entityId == 0) {
            var resp = await fetch.post('/v1/sys/entity/query', { id: this.component.props.entityId })
            this.setForm(resp[0])
        }
    }

    checkChanged = async () => {
        if (this.base.gs('data.other.isChanged')) {
            return await this.modal.confirm({
                title: '确认',
                content: '存在未保存的更改，是否继续该操作?'
            })
        }
        return true
    }

    prev = async () => {
        if (await this.checkChanged() == false)
            return
        var resp = await fetch.post('/v1/sys/entity/prev', { id: this.base.gs('data.form.id') })
        this.setForm(resp)
    }

    next = async () => {
        if (await this.checkChanged() == false)
            return
        var resp = await fetch.post('/v1/sys/entity/next', { id: this.base.gs('data.form.id') })
        this.setForm(resp)
    }

    add = async () => {
        if (await this.checkChanged() == false)
            return
        this.base.ss({ 'data': initState.data })
    }

    save = async () => {
        const form = this.base.gs('data.form')

        const msg = this.checkSave(form)

        if (msg.length > 0) {
            this.message.error(
                <ul style={{ textAlign: 'left' }}>
                    {msg.map(o => <li>{o}</li>)}
                </ul>
            )
            return false
        }

        var isModify = (form.id || form.id == 0)

        var resp

        if (isModify) {
            resp = await fetch.post('/v1/sys/entity/update', form)
        }
        else {
            resp = await fetch.post('/v1/sys/entity/create', form)
        }

        this.setForm(resp)
        this.message.success(isModify ? '修改实体成功' : '新增实体成功')
    }

    checkSave(form) {
        var msg = []
        !form.entityGroup && msg.push('所属组不能为空!');
        !form.code && msg.push('编码不能为空!');
        !form.name && msg.push('名称不能为空!');
        !form.tableName && msg.push('表名不能为空!'); 

        if (form.fields.length == 0)
            msg.push(`实体至少需要一行明细信息！`);

        form.fields.forEach((d, index) => {
            !d.code && msg.push(`明细第${index + 1}行，编号不能为空！`);
            !d.name && msg.push(`明细第${index + 1}行，名称不能为空！`); 
            !d.typeName && msg.push(`明细第${index + 1}行，类型不能为空！`);
        })

        return msg
    }



    headerAddRow = () => {
        this.addRow(-1)()
    }

    addRow = (rowIndex) => () => {
        var lst = this.base.gs('data.form.fields')
        lst.splice(rowIndex + 1, 0, initState.data.form.fields[0])
        this.base.ss({ 'data.form.fields': lst })
    }

    delRow = (rowIndex) => () => {
        var lst = this.base.gs('data.form.fields')
        lst.splice(rowIndex, 1)
        this.base.ss({ 'data.form.fields': lst })
    }

    loadEntityGroup = async () => {
        var res = await fetch.post('/v1/sys/entity/group/queryPageList', {})
        return res.list
    }

    loadTypeNames = async () => {
        var lst = this.base.gs('data.other.typeNames')
        return lst
    }
 

    //重写base setState方法，记录数据变化后写isChanged标志
    setState = (baseSetState) => (json) => {
        json['data.other.isChanged'] = (json['data.other.isChanged'] !== false)
        baseSetState(json)
    }

    setForm = (form) => {
        this.base.setState({
            'data.form': form,
            'data.other.isChanged': false
        })
    }

    tabActive = async () => {
        if (await this.checkChanged() == false)
            return
        var resp = await fetch.post('/v1/sys/entity/query', { id: this.component.props.entityId })
        this.setForm(resp[0])
    }

    tabClose = async () => {
        return await this.checkChanged()
    }

    genCode = async () => {
        const id = this.base.gs('data.form.id')
        if (!id) {
            this.message.error('请先保存实体')
            return
        }

        await fetch.post('/v1/sys/entity/genCode',[{ id }])
        this.message.success('生成代码成功') 

    }
}