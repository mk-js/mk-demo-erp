import webapi from './webapi'

var _options = {
	webapi,
	webapiMap: {
		'city.findById':'/v1/set/city/findById',
		'city.create': '/v1/set/city/create',
		'city.update': '/v1/set/city/update'
	}
}

function config(options) {
	if (options) {
		Object.assign(_options, options)
	}
}

config.current = _options

export default config