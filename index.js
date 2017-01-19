var npmPkgSearchByDependency = require('./npmPkgSearchByDependency')
var getFullPkgInfo = require('./getFullPkgInfo')

var dependency = 'zeppelin-vis'

exports.handler = (event, context, callback) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  npmPkgSearchByDependency(dependency, function (error, packages) {
    if (error) {
      console.error(error)
      process.exit(-1)
    }

    var N = packages.length
    var callbackMsg = []

    console.log('\nPackages matching \"' + dependency + '\": (' + N + ')\n')

    packages.forEach(function (pkg) {
      var registryURL = 'https://registry.npmjs.org/' + pkg.name + '/latest'
      callbackMsg.push(registryURL)
    })

    var jsonStringMsg = JSON.parse(JSON.stringify(callbackMsg).replace(/\'/g, ''))
    callback(null, jsonStringMsg)
  })
};