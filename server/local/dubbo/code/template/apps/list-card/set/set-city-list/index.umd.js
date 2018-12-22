__webpack_public_path__ = window["__pub_set-city-list__"];

const data = require('./data')
const config = require('./config')
require('./mock.js')
require('./style.less')

export default {
    name: "set-city-list",
    version: "1.0.0",
    description: "set-city-list",
    meta: data.getMeta(),
    components: [],
    config: config,
    load: (cb) => {
        cb(require('./component'), require('./action'), require('./reducer'))
	}
}