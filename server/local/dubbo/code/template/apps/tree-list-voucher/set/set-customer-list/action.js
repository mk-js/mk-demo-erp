import React from 'react'
import { action as MetaAction, AppLoader } from 'mk-meta-engine'
import config from './config'
import extend from './extend'
import utils from 'mk-utils'
class action {
    constructor(option) {
        this.metaAction = option.metaAction
        this.extendAction = option.extendAction
        this.config = config.current
        this.webapi = this.config.webapi
    }

    onInit = ({ component, injections }) => {
        this.extendAction.gridAction.onInit({ component, injections })
        this.component = component
        this.injections = injections
        injections.reduce('init')

        const pagination = this.metaAction.gf('data.pagination').toJS()
        this.load('all', pagination)
    }

    load = async (type, pagination, filter = { orderBy: 'default' }) => {
        var response, orderBy

        switch (filter.orderBy) {
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

        switch (type) {
            case 'all':
                response = await this.webapi.init({
                    pagination, filter: {
                        ...filter,
                        orderBy
                    }
                })
                response.filter = filter
                break
            case 'table':
                response = await this.webapi.customer.queryPageList({
                    pagination, filter: {
                        ...filter,
                        orderBy
                    }
                })
                response = { tableDs: response, filter }
                break
            case 'tree':
                response = await this.webapi.customerGroup.queryTree({})
                response = { treeDs: response || [] }
                break
        }
        this.injections.reduce('load', response)
    }

    reload = async () => {
        const pagination = this.metaAction.gf('data.pagination').toJS()
        const filter = this.metaAction.gf('data.filter').toJS()
        this.load('table', pagination, filter)
    }

    refresh = (data) => async () => {
        this.reload()
    }

    pageChanged = (current, pageSize) => {
        const filter = this.metaAction.gf('data.filter').toJS()
        this.load('table', { current, pageSize }, filter)
    }

    searchChange = utils._.debounce((v) => {
        const pagination = this.metaAction.gf('data.pagination').toJS(),
            filter = this.metaAction.gf('data.filter').toJS()

        filter.search = v
        this.load('table', pagination, filter)
    }, 200)




    treeSelect = (data) => (selectedKeys, info) => {
        const pagination = { current: 1, total: 0, pageSize: 20 },
            filter = { ...data.filter, customerGroupId: selectedKeys[0] }
        this.load('table', pagination, filter)

    }

    treeAdd = (data) => async () => {
        const customerGroupId = data.filter.customerGroupId,
            treeDs = data.treeDs,
            customerGroup = treeDs && utils.tree.find(treeDs, 'children', (n) => n.id == customerGroupId)

        const ret = await this.metaAction.modal('show', {
            title: '新增',
            children: this.metaAction.loadApp('set-customer-group', {
                store: this.component.props.store,
                parent: customerGroup
            }),
            bodyStyle: {
                height: 150
            },
            width: 400
        })

        if (ret) {
            this.load('tree')
        }
    }

    treeModify = (data) => async () => {
        const customerGroupId = data.filter.customerGroupId

        if (!customerGroupId) {
            this.metaAction.toast('error', '请选中一个客户组')
            return
        }

        const ret = await this.metaAction.modal('show', {
            title: '修改',
            children: this.metaAction.loadApp('set-customer-group', {
                store: this.component.props.store,
                customerGroupId
            }),
            bodyStyle: {
                height: 150
            },
            width: 400
        })
        if (ret) {
            this.load('tree')
        }

    }

    treeDel = (data) => async () => {
        const customerGroupId = data.filter.customerGroupId
        if (!customerGroupId) {
            this.metaAction.toast('error', '请选中一个客户组')
            return
        }

        const ret = await this.metaAction.modal('confirm', {
            title: '删除',
            content: '确认删除?'
        })

        const treeDs = data.treeDs,
            customerGroup = treeDs && utils.tree.find(treeDs, 'children', (n) => n.id == customerGroupId)

        if (ret) {
            const response = await this.webapi.customerGroup.del({ id: customerGroup.id, ts: customerGroup.ts })
            this.metaAction.toast('success', '删除客户组成功')
            const pagination = this.metaAction.gf('data.pagination').toJS()
            this.load('tree')
        }
    }

    treeRefresh = (data) => () => {
        this.load('tree')
    }



    del = (row) => async () => {
        const ret = await this.metaAction.modal('confirm', {
            title: '删除',
            content: '确认删除?'
        })

        if (!ret)
            return
        const { id, ts } = row
        await this.webapi.customer.del({ id, ts })
        this.metaAction.toast('success', '删除客户成功')
        this.reload()
    }

    add = (data) => async () => {
        const customerGroupId = data.filter.customerGroupId

        var treeDs = data.treeDs, customerGroup
        if (customerGroupId)
            customerGroup = treeDs && utils.tree.find(treeDs, 'children', (n) => n.id == customerGroupId)

        const ret = await this.metaAction.modal('show', {
            title: '新增',
            children: this.metaAction.loadApp('set-customer', {
                store: this.component.props.store,
                customerGroup
            }),
            bodyStyle: {
                height: 150
            },
            width: 400
        })

        if (ret) {
            this.reload()
        }
    }





    modify = (row) => async () => {
        const { id } = row
        const ret = await this.metaAction.modal('show', {
            title: '修改',
            children: this.metaAction.loadApp('set-customer', {
                store: this.component.props.store,
                customerId: id
            }),
            bodyStyle: {
                height: 150
            },
            width: 400
        })
        if (ret) {
            this.reload()
        }
    }

    sortSelected = ({ key }) => {
        const pagination = this.metaAction.gf('data.pagination').toJS(),
            filter = this.metaAction.gf('data.filter').toJS()
        filter.orderBy = key
        this.load('table', pagination, filter)
    }



    delBatch = (data) => async () => {
        const lst = data.list

        if (!lst || lst.length == 0) {
            this.metaAction.toast('error', '请选中要删除的客户')
            return
        }

        const selectRows = lst.filter(o => o.selected)

        if (!selectRows || selectRows.length == 0) {
            this.metaAction.toast('error', '请选中要删除的客户')
            return
        }

        const ret = await this.metaAction.modal('confirm', {
            title: '删除',
            content: '确认删除?'
        })

        if (!ret)
            return

        const customers = selectRows.map(o => ({ id: o.id, ts: o.ts }))
        await this.webapi.customer.delBatch(customers)
        this.metaAction.toast('success', '删除成功')
        this.reload()
    }

    loopTreeChildren = utils.tree.loopTreeChildren
}

export default function creator(option) {
    const metaAction = new MetaAction(option),
        extendAction = extend.actionCreator({ ...option, metaAction }),
        o = new action({ ...option, metaAction, extendAction })

    const ret = { ...metaAction, ...extendAction.gridAction, ...o }

    metaAction.config({ metaHandlers: ret })

    return ret
}