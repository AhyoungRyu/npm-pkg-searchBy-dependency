var RegClient = require('silent-npm-registry-client')
var stream = require('stream')
var stringify = require('json-stringify-pretty-compact')
var npmPkgSearchByDependency = require('./npmPkgSearchByDependency')
var dependency = 'zeppelin-vis'

/*
 run this file if you need to check in local
 npm run test
*/
npmPkgSearchByDependency(dependency, function (error, packages) {
    if (error) {
      console.error(error)
      process.exit(-1)
    }

    var N = packages.length
    var callbackMsg = []
    var params = { timeout: 1000 }
    var client = new RegClient({logstream: new stream.Writable()})
    var type = "VISUALIZATION"

    console.log('\nPackages matching \"' + dependency + '\": (' + N + ')\n')

    packages.forEach(function (pkg) {
      // get each package's url
      var registryURL = 'https://registry.npmjs.org/' + pkg.name + '/latest'
      callbackMsg.push(registryURL)

      // get each package's name, desc, artifact and license info
      client.get(registryURL, params, function (error, data) {
        if (error) {
          return callback(error)
        }
        var result = {
          type: type,
          name: data.name,
          description: data.description,
          artifact: data._id,
          license: data.license,
          icon: (data.icon == undefined) ? '<i class="fa fa-plug"></i>' : data.icon
        }

        var parsedBody = stringify(result)
        console.log(parsedBody);
      })
    })
    console.log(callbackMsg)
    console.log('')
})