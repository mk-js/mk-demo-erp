import config from './config'
import * as data from './data'

export default {
	name: "set-customer-list",
	version: "1.0.0",
	description: "set-customer-list",
	meta: data.getMeta(),
	components: [],
	config: config,
	load: (cb) => {
		require.ensure([], require => {
			cb(require('./component'), require('./action'), require('./reducer'))
		}, "set-customer-list")
	}
}