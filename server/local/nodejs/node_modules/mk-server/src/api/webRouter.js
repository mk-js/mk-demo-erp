const options = require('./../config').current;
const fs = require('fs')
const redirectCache = {}

const webRouter = (cfg) => {
  if (!cfg) return {}
  let routes = { dir: [], proxy: [], redirect: [] }
  if (typeof cfg == "string") {
    cfg = { "/": cfg }
  }

  buildRouters(cfg, routes)

  return routes
}

function buildRouters(obj, routes, hosts) {
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (key.startsWith("/")) {
      let uri = value.uri || value;
      if (typeof uri == "string" && uri.startsWith("http:")) {
        routes.proxy.push(proxyRouter(key, value, hosts))
      } else if (value.code == '302') {
        routes.redirect.push(redirectRouter(key, value, hosts))
      } else {
        routes.dir.push(dirRouter(key, value, hosts))
      }
    }
    else if (key.startsWith("server_name:")) {
      buildRouters(value, routes, key.split("server_name:")[1].split(" "))
    } else {
      throw ("route path mast start with / or http: , current value: " + value)
    }
  })
}

function dirRouter(path, obj, hosts) {
  let directoryPath = obj.path || obj;
  if (path.endsWith("/")) {
    path += "{param*}"
  }
  let route = {
    method: '*',
    path,
    handler: {
      directory: {
        path: directoryPath
      }
    }
  }
  if (obj.method) {
    route.method = obj.method
  }
  if (hosts) {
    route.vhost = hosts
  }
  return route
}

function redirectRouter(path, obj, hosts) {
  let key = hosts + '//' + path
  let route = {
    method: ["GET", "POST"],
    path,
    handler: (request, reply) => {
      let response = reply()
      let file = redirectCache[key]
      response.redirect(file)
      response.temporary(true)
    }
  }
  let file = redirectCache[key]
  if (file == null) {
    let reg = RegExp(obj.file)
    fs.readdir(obj.path, (err, files) => {
      if (!files) return
      let matched = files.filter(f => f.match(reg))
      file = matched && matched[0] || obj.file
      redirectCache[key] = file
    })
  }
  if (hosts) {
    route.vhost = hosts
  }
  return route
}

function proxyRouter(path, obj, hosts) {
  let host = obj.host
  let uri = obj.uri || obj
  let uriMap = obj.uriMap
  if (path.endsWith("/")) {
    path += "{path*}"
  }
  if (uri.endsWith("/")) {
    uri += "{path*}"
  }
  let route = {
    method: ["GET", "POST", "OPTIONS"],
    path,
    config: {
      cors: options.cors || false
    },
    handler: {
      proxy: {
        xforward: true,
        passThrough: true,
        host,
        uri,
        uriMap,
      }
    }
  }
  if (hosts) {
    route.vhost = hosts
  }
  return route
}

module.exports = webRouter