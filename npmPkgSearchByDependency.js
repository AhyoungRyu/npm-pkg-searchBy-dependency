var RegClient = require('silent-npm-registry-client')
var stream = require('stream')
var url = require('url')
var strfmt = require('util').format
var prttty = require('prttty').render

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

// pass dependency: 'zeppelin-vis'
module.exports = function npmPkgSearchByDependency (dependency, callback) {
  var params = { timeout: 2000 }
  var options = (typeof dependency === 'object') ? dependency : {
    dependency: dependency,
    registryURL: 'https://registry.npmjs.org/',
    debug: true
  }

  var log = options.debug ? console.log.bind(console) : function () {}
  var client = new RegClient({logstream: new stream.Writable()})
  // construct registry url
  var uri = searchUri(options.registryURL, options.dependency)

  log('Querying', uri)

  client.get(uri, params, function (error, data, raw) {
    // pass errors to callback
    if (error) {
      return callback(error)
    }
    // data is the parsed data object
    // raw is the json string
    log('Response', prttty(data || raw))

    callback(null, data.rows.map(function (r) {
      // This is what a row looks like:
      //
      // { value: 1
      // , key: [ 'zeppelin-vis'
      //        , 'zeppelin-highcharts-spline'
      //        , 'Draw spline graph using Highcharts library'
      //        ]
      // }
      return {
        name: r.key[1],
        description: r.key[2]
      }
    }))
  })
}
