import webapi from './webapi'

var _options = {
	webapi,
	webapiMap: {
		'customerGroup.query': '/v1/set/customer/group/query',
		'customerGroup.queryTree': '/v1/set/customer/group/queryTree',
		'customerGroup.findById':'/v1/set/customer/group/findById',
		'customerGroup.create': '/v1/set/customer/group/create',
		'customerGroup.update': '/v1/set/customer/group/update'
	}
}

function config(options) {
	if (options) {
		Object.assign(_options, options)
	}
}

config.current = _options

export default config