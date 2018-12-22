import {ui} from 'mk-utils'

export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'set-opt-sln-type simple-modal-card',
		children: {
			component: '##form',
			items: [
				{ type: 'treeSelect', title: '上级客户组', bindPath: 'data.form.customerGroup', dsPath: 'data.other.customerGroups', onFocus: 'customerGroupFocus' },
				{ type: 'input', title: '客户组编码', required: true, bindPath: 'data.form.code',  addonBefore: '{{data.form.customerGroup && data.form.customerGroup.code }}' },
				{ type: 'input', title: '客户组名称', required: true, bindPath: 'data.form.name' }
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