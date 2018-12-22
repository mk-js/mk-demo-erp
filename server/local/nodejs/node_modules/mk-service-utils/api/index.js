const env = require('./env')
const md5 = require('./md5')
const objectId = require('./objectId')

module.exports = {
  _init: (current) => {
    md5.key = current.md5 && current.md5.key
  },
  env,
  md5,
  objectId
}