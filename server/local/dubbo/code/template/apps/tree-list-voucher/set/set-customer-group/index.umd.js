__webpack_public_path__ = window["__pub_set-customer-group__"];

const data = require('./data')
const config = require('./config')
require('./mock.js')
require('./style.less')

export default {
    name: "set-customer-group",
    version: "1.0.0",
    description: "set-customer-group",
    meta: data.getMeta(),
    components: [],
    config: config,
    load: (cb) => {
        cb(require('./component'), require('./action'), require('./reducer'))
	}
}