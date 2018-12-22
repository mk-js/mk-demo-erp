import React from 'react'
import { action as MetaAction, AppLoader } from 'mk-meta-engine'
import config from './config'
import extend from './extend'
import { fromJS } from 'immutable'
import utils from 'mk-utils'

class action {
    constructor(option) {
        this.metaAction = option.metaAction
        this.extendAction = option.extendAction
        this.config = config.current
        this.webapi = this.config.webapi
    }

    onInit = ({ component, injections }) => {
        this.extendAction.formAction.onInit({ component, injections })
        this.component = component
        this.injections = injections
        if (this.component.props.setOkListener)
            this.component.props.setOkListener(this.onOk)

        if (this.component.props.customerId || this.component.props.customerId == 0) {
            injections.reduce('init')
            this.load()
        }
        else {
            injections.reduce('init', {
                customerGroup: this.component.props.customerGroup
            })
        }
    }

    load = async () => {
        if (this.component.props.customerId || this.component.props.customerId == 0) {
            var response = await this.webapi.customer.findById(this.component.props.customerId)
            this.injections.reduce('load', response)
        }
    }

    onOk = async () => {
        return await this.save()
    }

    save = async () => {
        const form = this.metaAction.gf('data.form').toJS()

        const msg = this.checkSave(form)

        if (msg.length > 0) {
            this.metaAction.toast('error', utils.ui.toToastContent(msg))
            return false
        }

        var isModify = (form.id || form.id == 0)
        const response = isModify ?
            await this.webapi.customer.update(form) :
            await this.webapi.customer.create(form)

        this.metaAction.toast('success', isModify ? '修改客户成功' : '新增客户成功')
        this.injections.reduce('setForm', response)
        return true
    }

    checkSave = (form) => {
        var msg = []
        !form.customerGroup && msg.push('请录入客户组!');
        !form.code && msg.push('请录入客户编码!');
        !form.name && msg.push('请录入客户名称!');
        return msg
    }

    customerGroupFocus = (data) => utils._.throttle(async () => {
        const response = await this.webapi.customerGroup.queryTree()
        this.metaAction.sf('data.other.customerGroups', fromJS(response))
    }, 200)

    loopTreeSelectChildren = utils.tree.loopTreeSelectChildren
    treeFind = utils.tree.findById
}

export default function creator(option) {
    const metaAction = new MetaAction(option),
        extendAction = extend.actionCreator({ ...option, metaAction }),
        o = new action({ ...option, metaAction, extendAction }),
        ret = { ...metaAction, ...extendAction.formAction, ...o }

    metaAction.config({ metaHandlers: ret })

    return ret
}