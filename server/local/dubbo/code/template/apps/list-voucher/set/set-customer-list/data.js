export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'set-customer-list tree-table',
		children: [{
			name: 'left',
			component: 'Card',
			className: 'tree-table-left',
			title: '客户组',
			extra: {
				name: 'header',
				component: '::div',
				children: [
					{ component: '##iconButton', icon: 'refresh', title: '刷新', onClick: 'treeRefresh', type: 'showy' },
					{ component: '##iconButton', icon: 'plus', title: '新增', onClick: 'treeAdd' },
					{ component: '##iconButton', icon: 'edit', title: '修改', onClick: 'treeModify' },
					{ component: '##iconButton', icon: 'close', title: '删除', onClick: 'treeDel' }
				]
			},
			children: [{
				name: 'tree',
				component: 'Tree',
				selectedKeys: `{{[data.filter.customerGroupId+'']}}`,
				onSelect: '{{$treeSelect(data)}}',
				onExpand: `{{(expandedKeys)=>$sf('data.exandedKeys',expandedKeys )}}`,
				expandedKeys: '{{data.exandedKeys}}',
				children: `{{$loopTreeChildren(data.treeDs, 'children', 'id', 'name', 'code')}}`
			}]
		}, {
			name: 'content',
			component: 'Card',
			className: 'tree-table-content',
			title: {
				name: 'left',
				component: '::div',
				className: 'tree-table-content-header-left',
				children: [{
					name: 'search',
					component: 'Input.Search',
					className: 'tree-table-content-header-left-search',
					placeholder: '编码/名称',
					value: '{{data.filter.search}}',
					onChange: `{{ (e)=>{$sf('data.filter.search', e.target.value);$searchChange(e.target.value)}}}`
				}, {
					name: 'sort',
					component: '##sortMenu',
					bindPath: 'data.filter.orderBy',
					selectedClassName: 'tree-table-content-header-left-sort-selected',
					onClick: 'sortSelected',
					options: [
						{ key: 'default', title: '默认' },
						{ key: 'codeDesc', title: '编码从大到小' },
						{ key: 'codeAsc', title: '编码从小到大' },
						{ key: 'nameDesc', title: '名称从大到小' },
						{ key: 'nameAsc', title: '名称从小到大' },
					]
				},{ 
					component: '##iconButton', icon: 'refresh', title: '刷新', onClick: 'refresh', type: 'showy' 
				}]
			},
			extra: {
				name: 'header',
				component: '::div',
				className: 'tree-table-content-header-right',
				children: [
					{ component: '##button', title: '新增客户', onClick: 'add' },
					{ component: '##button', title: '批量删除', onClick: 'delBatch' }
				]
			},
			children: {
				component: '##readonlyGrid',
				columns: [{
					type: 'sel', bindField: 'selected'
				},{
					type: 'del', onDel: 'del'
				},{
					type: 'link', title: '代码', bindField: 'code', width: 100 ,onClick: 'modify'
				},{
					type: 'text', title: '名称', bindField: 'name', width: 100
				}]
			}
		}]
	}
}


export function getInitState() {
	return {
		data: {
			list: [{}],
			pagination: { current: 1, total: 0, pageSize: 20 },
			filter: {
				orderBy: 'default'
			},
			other: {}
		}
	}
}
