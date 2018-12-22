import React from 'react'
import { action as MetaAction, AppLoader } from 'mk-meta-engine'
import config from './config'
import utils from 'mk-utils'

class action {
    constructor(option) {
        this.metaAction = option.metaAction
        this.config = config.current
        this.webapi = this.config.webapi
    }

    onInit = ({ component, injections }) => {
        this.component = component
        this.injections = injections
        injections.reduce('init')

        const pagination = this.metaAction.gf('data.pagination').toJS()
        this.load(pagination)
    }

    load = async (pagination, filter = { orderBy : 'default' } ) => {
        var orderBy
        switch(filter.orderBy){
            case 'default':
                orderBy = 'updateTime desc'
                break
            case 'codeDesc':
                orderBy = 'code desc'
                break
            case 'codeAsc':
                orderBy = 'code asc'
                break
                case 'nameDesc':
                orderBy = 'name desc'
                break
            case 'nameAsc':
                orderBy = 'name asc'
                break
        }
        const response = await this.webapi.city.queryPageList({ 
            pagination, 
            filter:{
                ...filter,
                orderBy
            }
        })
        if (!response.pagination)
            response.pagination = pagination
        response.filter = filter
        this.injections.reduce('load', response)
    }

    

    reload = async () => {
        const pagination = this.metaAction.gf('data.pagination').toJS(),
            filter = this.metaAction.gf('data.filter').toJS()

        this.load(pagination, filter)
    }

    pageChanged = (current, pageSize) => {
        const filter = this.metaAction.gf('data.filter').toJS()

        this.load({ current, pageSize }, filter)
    }

    refresh = () => {
        this.reload()
    }

    del = (row) => async () => {
        const ret = await this.metaAction.modal('confirm', {
            title: '删除',
            content: '确认删除?'
        })

        if (!ret)
            return

        const id = row.id,
            ts = row.ts

        await this.webapi.city.del({ id, ts })
        this.metaAction.toast('success', '删除成功')
        this.reload()
    }

    modify = (id) => async () => {

        const ret = await this.metaAction.modal('show', {
            title: '城市',
            children: this.metaAction.loadApp('set-city', {
                store: this.component.props.store,
                cityId: id
            }),
            width: 400,
            bodyStyle: {
                height: 190
            }
        })

        if (ret) {
            this.reload()
        }
    }

    add = async () => {
        const ret = await this.metaAction.modal('show', {
            title: '城市',
            children: this.metaAction.loadApp('set-city', {
                store: this.component.props.store
            }),
            width: 400,
            bodyStyle: {
                height: 190
            }
        })

        if (ret) {
            this.reload()
        }
    }

    searchChange = utils._.debounce((v) => {
        const pagination = this.metaAction.gf('data.pagination').toJS(),
            filter = this.metaAction.gf('data.filter').toJS()

        filter.search = v
        this.load(pagination, filter)
    }, 200)

    sortSelected = ({ key }) => {
        const pagination = this.metaAction.gf('data.pagination').toJS(),
            filter = this.metaAction.gf('data.filter').toJS()
        filter.orderBy = key
        this.load(pagination, filter)
    }
}

export default function creator(option) {
    const metaAction = new MetaAction(option),
        o = new action({ ...option, metaAction }),
        ret = { ...metaAction, ...o }

    metaAction.config({ metaHandlers: ret })

    return ret
}