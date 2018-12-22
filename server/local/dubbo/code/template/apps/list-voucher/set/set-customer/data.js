import { ui } from 'mk-utils'

export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'set-customer simple-modal-card',
		children: {
			component: '##form',
			items: [
				{ type: 'treeSelect', title: '客户组', required: true, bindPath: 'data.form.customerGroup', dsPath: 'data.other.customerGroups', onFocus: 'customerGroupFocus' },
				{ type: 'input', title: '客户编码', required: true, bindPath: 'data.form.code' },
				{ type: 'input', title: '客户名称', required: true, bindPath: 'data.form.name' }
			]
		}
	}
}


export function getInitState(option) {
	var state = {
		data: {
			form: {
			},
			other: {
				error: {}
			}
		}
	}
	return state
}