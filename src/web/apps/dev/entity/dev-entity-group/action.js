
import { actionMixin, fetch } from 'maka'
import React from 'react'

@actionMixin('base', 'lodash', 'moment', 'modal', 'message')
export default class action {
    constructor(option) {
        Object.assign(this, option.mixins)
    }

    onInit = () => {
        if (this.component.props.setOkListener)
            this.component.props.setOkListener(this.onOk)
        this.load()
    }

    load = async () => {
        if (this.component.props.entityGroupId || this.component.props.entityGroupId == 0) {
            var resp = await fetch.post('/v1/sys/entity/group/query', { id: this.component.props.entityGroupId })
            this.base.setState({ 'data.form': resp[0] })
        }
        else if(this.component.props.parent){
            this.base.setState({'data.form.parent': this.component.props.parent})
        }
    }

    onOk = async () => {
        return await this.save()
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
            resp = await fetch.post('/v1/sys/entity/group/update', form)
        }
        else {
            resp = await fetch.post('/v1/sys/entity/group/create', form)
        }

        this.base.setState({ 'data.form': resp })
        this.message.success(isModify ? '修改实体组成功' : '新增实体组成功')

        return resp
    }


    checkSave = (form) => {
        var msg = []
        !form.code && msg.push('请录入编码!');
        !form.name && msg.push('请录入名称!');
        return msg
    }
 

}