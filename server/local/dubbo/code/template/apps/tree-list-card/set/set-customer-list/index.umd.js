__webpack_public_path__ = window["__pub_set-customer-list__"];

const data = require('./data')
const config = require('./config')
require('./mock.js')
require('./style.less')

export default {
    name: "set-customer-list",
    version: "1.0.0",
    description: "set-customer-list",
    meta: data.getMeta(),
    components: [],
    config: config,
    load: (cb) => {
        cb(require('./component'), require('./action'), require('./reducer'))
	}
}