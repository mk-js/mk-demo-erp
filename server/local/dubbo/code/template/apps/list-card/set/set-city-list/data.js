export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'simple-list sys-website-list',
		children: [{
			name: 'header',
			component: 'Layout',
			className: 'simple-list-header',
			children: [{
				name: 'left',
				component: 'Layout',
				className: 'simple-list-header-left',
				children: [{
					name: 'search',
					component: 'Input.Search',
					className: 'simple-list-header-left-search',
					placeholder: '录入编码或名称搜索',
					value: '{{data.filter.search}}',
					onChange: `{{ (e)=>{$sf('data.filter.search', e.target.value);$searchChange(e.target.value)}}}`
				}, {
					name: 'sort',
					component: 'Dropdown',
					overlay: {
						name: 'menu',
						component: 'Menu',
						onClick: '{{$sortSelected}}',
						children: [
							getSortMenuItem('default', '默认'),
							getSortMenuItem('codeDesc', '编码从大到小'),
							getSortMenuItem('codeAsc', '编码从小到大'),
							getSortMenuItem('nameDesc', '名称从大到小'),
							getSortMenuItem('nameAsc', '名称从小到大'),
						]
					},
					children: {
						name: 'sort',
						component: 'Button',
						iconFontFamily: 'awesome',
						className: 'common-icon-button',
						icon: 'sort-amount-desc',
						type: 'softly'
					}
				}, {
					name: 'refresh',
					component: 'Button',
					iconFontFamily: 'awesome',
					className: 'common-icon-button',
					icon: 'refresh',
					type: 'showy',
					title: '刷新',
					onClick: '{{$reload}}'
				}]
			}, {
				name: 'center',
				component: 'Layout',
				className: 'simple-list-header-center',
			}, {
				name: 'right',
				component: 'Layout',
				className: 'simple-list-header-right',

				children: [{
					name: 'add',
					component: 'Button',
					type: 'bluesky',
					children: '新增城市',
					onClick: '{{$add}}'
				}]
			}]
		}, {
			name: 'content',
			className: 'simple-list-content',
			component: 'Layout',
			children: [{
				name: 'dataGrid',
				component: 'DataGrid',
				headerHeight: 32,
				rowHeight: 30,
				enableSequence: true,
				startSequence: '{{(data.pagination.current-1)*data.pagination.pageSize + 1}}',
				rowsCount: "{{data.list ? data.list.length : 0}}",
				columns: [{
					name: 'oprate',
					component: 'DataGrid.Column',
					columnKey: 'oprate',
					fixed: true,
					width: 40,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '操作'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						_power: '({rowIndex})=>rowIndex',
						children: [{
							name: 'del',
							component: 'Icon',
							showStyle: 'showy',
							type: 'close',
							style: {
								fontSize: 16
							},
							title: '删除',
							onClick: '{{$del(data.list[_rowIndex])}}'
						}]
					}
				}, {
					name: 'code',
					component: 'DataGrid.Column',
					columnKey: 'code',
					width: 200,
					flexGrow: 1,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '城市编码'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						className: 'f-table-cell f-table-cell-left',
						_power: '({rowIndex})=>rowIndex',
						children: {
							name: 'link',
							component: '::a',
							children: '{{data.list[_rowIndex].code}}',
							onClick: '{{$modify(data.list[_rowIndex].id)}}'
						},
					},
				}, {
					name: 'name',
					component: 'DataGrid.Column',
					columnKey: 'name',
					width: 50,
					flexGrow: 1,
					header: {
						name: 'header',
						component: 'DataGrid.Cell',
						children: '城市名称'
					},
					cell: {
						name: 'cell',
						component: 'DataGrid.Cell',
						className: 'f-table-cell f-table-cell-left',
						_power: '({rowIndex})=>rowIndex',
						children: '{{data.list[_rowIndex].name}}',
					}
				}]
			}]
		}, {
			name: 'footer',
			className: 'simple-list-footer',
			component: 'Layout',
			children: [{
				name: 'pagination',
				component: 'Pagination',
				showSizeChanger: true,
				pageSize: '{{data.pagination.pageSize}}',
				current: '{{data.pagination.current}}',
				total: '{{data.pagination.total}}',
				onChange: '{{$pageChanged}}',
				onShowSizeChange: '{{$pageChanged}}'
			}]
		}]
	}
}

export function getInitState() {
	return {
		data: {
			list: [],
			pagination: { current: 1, total: 0, pageSize: 20 },
			filter: {
				orderBy: 'default'
			},
			other: {}
		}
	}
}

function getSortMenuItem(key, title) {
	return {
		name: key,
		component: 'Menu.Item',
		key: key,
		className: `{{data.filter.orderBy == '${key}' ? 'simple-list-header-left-sort-selected':'' }}`,
		children: [title, {
			name: 'checked',
			component: 'Icon',
			type: 'check',
			_visible: `{{data.filter.orderBy == '${key}'}}`
		}]
	}
}