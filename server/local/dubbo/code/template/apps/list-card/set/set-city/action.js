import React from 'react'
import { action as MetaAction, AppLoader } from 'mk-meta-engine'
import config from './config'
import extend from './extend'

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
        injections.reduce('init')
        this.load()
    }

    load = async () => {
        if (this.component.props.cityId || this.component.props.cityId == 0) {
            var response = await this.webapi.city.findById(this.component.props.cityId)

            this.injections.reduce('load', response)
        }

    }

    onOk = async () => {
        return await this.save()
    }

    save = async () => {
        const form = this.metaAction.gf('data.form').toJS()

        const ok = await this.extendAction.formAction.check([{
            path: 'data.form.name', value: form.name
        }, {
            path: 'data.form.code', value: form.code
        }], this.check)

        if (!ok) return false

        if (form.id || form.id == 0) {
            const response = await this.webapi.city.update(form)
            if (response) {
                this.metaAction.toast('success', '修改城市成功')
                this.injections.reduce('load', response)
                return response
            }

        } else {
            const response = await this.webapi.city.create(form)
            if (response) {
                this.metaAction.toast('success', '新增城市成功')
                this.injections.reduce('load', response)
                return response
            }
        }
        return true
    }

    check = async (option) => {
        if (!option || !option.path)
            return

        if (option.path == 'data.form.name') {
            return { errorPath: 'data.other.error.name', message: option.value ? '' : '请录入城市名称' }
        }
        else if (option.path == 'data.form.code') {
            return { errorPath: 'data.other.error.code', message: option.value ? '' : '请录入城市编码' }
        }
    }

    fieldChange = (path, value) => {
        this.extendAction.formAction.fieldChange(path, value, this.check)
    }
}

export default function creator(option) {
    const metaAction = new MetaAction(option),
        extendAction = extend.actionCreator({ ...option, metaAction }),
        o = new action({ ...option, metaAction, extendAction }),
        ret = { ...metaAction, ...extendAction.formAction, ...o }

    metaAction.config({ metaHandlers: ret })

    return ret
}