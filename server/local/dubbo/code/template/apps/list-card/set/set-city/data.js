export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'set-city simple-modal-card',
		children: [{
			name: 'form',
			component: 'Form',
			className: 'simple-modal-card-form',
			children: [{
				name: 'code',
				component: 'Form.Item',
				label: '城市编码',
				required: true,
				validateStatus: "{{data.other.error.name?'error':'success'}}",
				help: '{{data.other.error.code}}',
				children: [{
					name: 'code',
					component: 'Input',
					value: '{{data.form.code}}',
					onChange: `{{(e)=>$fieldChange('data.form.code',e.target.value)}}`,
				}]
			},{
				name: 'name',
				component: 'Form.Item',
				label: '城市名称',
				required: true,
				validateStatus: "{{data.other.error.name?'error':'success'}}",
				help: '{{data.other.error.name}}',
				children: [{
					name: 'name',
					component: 'Input',
					value: '{{data.form.name}}',
					onChange: `{{(e)=>$fieldChange('data.form.name',e.target.value)}}`,
				}]
			}]
		}]
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