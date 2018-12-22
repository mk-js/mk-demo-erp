import webapi from './webapi'

var _options = {
	webapi,
	webapiMap: {
		'city.query': '/v1/set/city/query',
		'city.queryPageList': '/v1/set/city/queryPageList',
		'city.del': '/v1/set/city/delete',
	}
}

function config(options) {
	if (options) {
		Object.assign(_options, options)
	}
}

config.current = _options

export default config