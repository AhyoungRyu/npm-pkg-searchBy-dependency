var RegClient = require('silent-npm-registry-client')
var stream = require('stream')
var url = require('url')
var strfmt = require('util').format
var prttty = require('prttty').render
var Promise = require('bluebird')

function searchUri (registryURL, dependency) {
  var u = url.parse(registryURL)
  return url.format({
    protocol: u.protocol,
    host: u.host,
    pathname: /^\/?$/.test(u.pathname) ? '/-/_view/dependedUpon' : u.pathname,
    query: {
      startkey: strfmt('["%s"]', dependency),
      endkey: strfmt('["%s",{}]', dependency),
      group_level: 3
    }
  })
}

module.exports = function npmPkgSearchByDependency (dependency, callback) {
  var params = {timeout: 1000}
  var options = (typeof dependency === 'object') ? dependency : {
    dependency: dependency,
    registryURL: 'https://registry.npmjs.org/',
    debug: true
  }

  var log = options.debug ? console.log.bind(console) : function () {
  }
  var client = new RegClient({logstream: new stream.Writable()})
  client = Promise.promisifyAll(client)

  var uri = searchUri(options.registryURL, options.dependency)

  log('Querying', uri)

  client.getAsync(uri, params)
    .then(function (data, raw) {
      log('Response', prttty(data || raw))

      callback(null, data.rows.map(function (r) {
        return {
          name: r.key[1],
          description: r.key[2],
          uri: options.registryURL + r.key[1]
        }
      }))
    })
    .catch(function (error) {
      return callback(error)
    })
}