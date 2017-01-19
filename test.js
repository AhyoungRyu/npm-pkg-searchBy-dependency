var npmPkgSearchByDependency = require('./npmPkgSearchByDependency')
var getFullPkgInfo = require('./getFullPkgInfo')

var dependency = 'zeppelin-vis'

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

      console.log(registryURL)
      callbackMsg.push(registryURL)
    })
    console.log('')
})