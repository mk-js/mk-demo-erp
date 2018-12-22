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

        if (this.component.props.customerGroupId || this.component.props.customerGroupId == 0) {
            injections.reduce('init')
            this.load()
        }
        else {
            injections.reduce('init', {
                customerGroup: this.component.props.parent
            })
        }
    }

    load = async () => {
        if (this.component.props.customerGroupId || this.component.props.customerGroupId == 0) {
            var response = await this.webapi.customerGroup.findById(this.component.props.customerGroupId)
            
            if (response.customerGroup
                && response.code.length > response.customerGroup.code.length
                && response.code.substr(0, response.customerGroup.code.length) == response.customerGroup.code)
                response.code = response.code.substr(response.customerGroup.code.length )

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

        if(form.customerGroup)
            form.code = form.customerGroup.code + form.code

        var isModify = (form.id || form.id == 0)
        const response = isModify ?
            await this.webapi.customerGroup.update(form) :
            await this.webapi.customerGroup.create(form)

        this.metaAction.toast('success', isModify ? '修改客户组成功' : '新增客户组成功')
        this.injections.reduce('setForm', response)
        return true
    }

    checkSave = (form) => {
        var msg = []
        !form.code && msg.push('请录入客户组编码!');
        !form.name && msg.push('请录入客户组名称!');
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