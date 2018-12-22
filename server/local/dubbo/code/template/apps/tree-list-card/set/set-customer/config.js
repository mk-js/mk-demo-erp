import webapi from './webapi'

var _options = {
	webapi,
	webapiMap: {
		'customer.query': '/v1/set/customer/query',
		'customer.findById':'/v1/set/customer/findById',
		'customer.create': '/v1/set/customer/create',
		'customer.update': '/v1/set/customer/update',
		'customerGroup.queryTree': '/v1/set/customer/group/queryTree',
	}
}

function config(options) {
	if (options) {
		Object.assign(_options, options)
	}
}

config.current = _options

export default config