
import { actionMixin, fetch, createAppElement } from 'maka'

@actionMixin('base', 'lodash', 'moment', 'tableHelper', 'treeHelper', 'modal', 'message')
export default class action {
    constructor(option) {
        Object.assign(this, option.mixins)
        this.searchReload = this.lodash.debounce(this.searchReload, 200)
    }

    onInit = () => {
        const pagination = this.base.gs('data.pagination')
        this.load('all', pagination)
    }

    load = async (type, pagination, filter = { search: '' }) => {
        var tree, list, entitys
        switch (type) {
            case 'all':
                tree = (await fetch.post('/v1/sys/entity/group/queryPageList', {})).list || []
                tree = this.treeHelper.build(tree)
                entitys = await fetch.post('/v1/sys/entity/queryPageList', { pagination, filter })
                list = entitys.list || []
                pagination = entitys.pagination
                break
            case 'list':
                entitys = await fetch.post('/v1/sys/entity/queryPageList', { pagination, filter })
                list = entitys.list || []
                pagination = entitys.pagination
                break
            case 'tree':
                tree = (await fetch.post('/v1/sys/entity/group/queryPageList', {})).list || []
                tree = this.treeHelper.build(tree)
                break
        }

        filter.search = this.base.gs('data.filter.search')
        var json = {}
        if (tree) {
            json = {
                ...json,
                'data.tree': tree
            }
        }

        if (list) {
            json = {
                ...json,
                'data.pagination': pagination,
                'data.filter': filter,
                'data.list': list
            }
        }

        this.base.ss(json)
    }

    treeReload = () => {
        this.load('tree')
    }

    treeSelect = (selectedKeys, info) => {
        const pagination = { current: 1, total: 0, pageSize: 20 },
            filter = { entityGroupId: selectedKeys[0] }
        this.load('list', pagination, filter)
    }

    treeAdd = async () => {
        const data = this.base.gs()
        const entityGroupId = data.filter.entityGroupId,
            tree = data.tree,
            entityGroup = (tree && this.treeHelper.findById(tree, entityGroupId))

        const ret = await this.modal.show({
            title: '新增',
            children: createAppElement('dev-entity-group', {
                parent: entityGroup
            }),
            bodyStyle: {
                height: 200
            },
            width: 400
        })

        if (ret) {
            this.load('tree')
        }
    }

    treeModify = async () => {
        const data = this.base.gs()
        const entityGroupId = data.filter.entityGroupId

        if (!entityGroupId) {
            this.message.error('请选中一个实体组')
            return
        }

        const ret = await this.modal.show({
            title: '修改',
            children: createAppElement('dev-entity-group', {
                entityGroupId
            }),
            bodyStyle: {
                height: 200
            },
            width: 400
        })
        if (ret) {
            this.load('tree')
        }
    }

    treeDel = async () => {
        const data = this.base.gs()
        const entityGroupId = data.filter.entityGroupId
        if (!entityGroupId) {
            this.message.error('请选中一个实体组')
            return
        }

        const ret = await this.modal.confirm({
            title: '删除',
            content: '确认删除?'
        })

        if (ret) {
            await fetch.post('/v1/sys/entity/group/del', {id: entityGroupId})
            this.message.success('删除实体组成功')
            this.load('tree')
        }
    }

    reload = async () => {
        const pagination = this.base.gs('data.pagination'),
            filter = this.base.gs('data.filter')
        this.load('list', pagination, filter)
    }


    pageChanged = (current, pageSize) => {
        const filter = this.base.gs('data.filter')
        this.load('list', { current, pageSize }, filter)
    }

    searchChange = (e) => {
        var v = e.target.value
        this.base.setState({ 'data.filter.search': v })

        this.searchReload(v)
    }

    searchReload = (v) => {
        const pagination = this.base.gs('data.pagination'),
            filter = this.base.gs('data.filter')

        filter.search = v
        this.load('list', pagination, filter)
    }
 
    add = async () => {
        this.component.props.setPortalContent && this.component.props.setPortalContent('新增实体', 'dev-entity')
    }

    modify = row => async () => {
        this.component.props.setPortalContent && this.component.props.setPortalContent('修改实体', 'dev-entity', {entityId: row.id})
    }
 
    del = row => async () => {
        var ret = await this.modal.confirm({
            title: '删除',
            content: '确认删除?'
        })

        if (!ret)
            return

        const { id, ts } = row

        await fetch.post('/v1/sys/entity/delete',  { id, ts } )

        this.message.success('删除实体成功')
        this.reload()
    }

    batchDel = async () => {
        const lst = this.base.gs('data.list')

        if (!lst || lst.length == 0) {
            this.message.error('请选中要删除的实体')
            return
        }

        const selectRows = lst.filter(o => o.isSelected)

        if (!selectRows || selectRows.length == 0) {
            this.message.error('请选中要删除的实体')
            return
        }

        const ret = await this.modal.confirm({
            title: '删除',
            content: '确认删除?'
        })

        if (!ret)
            return

        const entitys = selectRows.map(o => ({ id: o.id, ts: o.ts}))

        await fetch.post('/v1/sys/entity/deleteBatch', entitys)

        this.message.success('删除成功')
        this.reload()
    }

    genEntity = async () => {   
 
        await fetch.post('/v1/sys/entity/genEntity',{ dbName: '' }) 
        
        this.message.success('生成实体成功')
        this.reload()
    }

    genCode = async () => {

        const lst = this.base.gs('data.list')

        if (!lst || lst.length == 0) {
            this.message.error('请选中至少一个实体')
            return
        }

        const selectRows = lst.filter(o => o.isSelected)

        if (!selectRows || selectRows.length == 0) {
            this.message.error('请选中至少一个实体')
            return
        } 
 
        const entitys = selectRows.map(o => ({ id: o.id, ts: o.ts})) 
        
        await fetch.post('/v1/sys/entity/genCode', entitys)

        this.message.success('下载代码成功')
    }

}