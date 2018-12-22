import webapi from './webapi'

var _options = {
	webapi,
	webapiMap: {
		'customerGroup.query': '/v1/set/customer/group/query',
		'customerGroup.queryTree': '/v1/set/customer/group/queryTree',
		'customerGroup.del':'/v1/set/customer/group/delete',
		'customer.query': '/v1/set/customer/query',
		'customer.queryPageList': '/v1/set/customer/queryPageList',
		'customer.del': '/v1/set/customer/delete',
		'customer.delBatch': '/v1/set/customer/deleteBatch'
	}
}

function config(options) {
	if (options) {
		Object.assign(_options, options)
	}
}

config.current = _options

export default config