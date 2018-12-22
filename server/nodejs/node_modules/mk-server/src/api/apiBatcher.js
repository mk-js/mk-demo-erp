
const options = require('./../config').current;

let map
let rootUrl
function batcher(services, urlApiMap, apiRootUrl) {
  map = urlApiMap
  rootUrl = apiRootUrl
  services['/'] = {
    api: {
      '/': handler
    },
    name: 'apiBatcher',
  }
}

function handler(data, ctx) {
  // console.log(data)
  // console.log(map)
  let result = {}
  let all = []
  data && Object.keys(data).forEach(key => {
    let url = data[key][0]
    let arg = data[key][1]
    let api = map[url]
    if(!api || typeof api !='function'){
      console.log('batcher caller faill : ' + url)
    }
    var promise = api(arg, ctx);
    all.push(promise)
    promise
      .then(r => {
        result[key] = r
        return r
      })
  });
  Promise.all(all)
    .then(values => ctx.return(result))
    .catch(ctx.error)
}

handler.apiUrl = '/'

module.exports = batcher
