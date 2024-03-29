const menu = [{
    key: '1',
    title: '首页',
    appName: 'home',
    appProps: {},
    icon: 'home'
},{
    key: '2',
    title: '仪表盘',
    appName: 'dashboard',
    appProps: {},
    icon: 'dashboard'
}, {
    key: '3',
    title: '基础档案',
    children: [{
        key: '301',
        title: '人员',
        appName: 'set-person-list'
    },{
        key: '302',
        title: '客户',
        appName: 'set-customer-list'
    },{
        key: '303',
        title: 'BOM',
        appName: 'set-bom-list'
    }]
}, {
    key: '4',
    title: '系统设置',
    children: [{
        key: '401',
        title: '实体',
        appName: 'sys-entity-list'
    },{
        key: '402',
        title: '数据',
        appName: 'set-entity-data'
    }]
}]
export default {
    data: {
        menu,
        menuSelectedKeys: [],
        menuDefaultOpenKeys: [],
        content: {},
        openTabs: [],
        isTabsStyle: true,
        isFoldMenu: true,
        other: {},
        aa:1
    }
}