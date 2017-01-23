var argv = require('minimist')(process.argv.slice(2))
var stringify = require('json-stringify-pretty-compact')
var npmPkgSearchByDependency = require('./npmPkgSearchByDependency')


/*
 If it didn't get any args, will search packages which have 'zeppelin-vis' by default
 command: npm test 'any_dependencies' (e.g. 'babel-core')
*/
var dependency = (argv._.length === 0) ? 'zeppelin-vis' : argv._[0]

npmPkgSearchByDependency(dependency, function (error, packages) {
    if (error) {
      console.error(error)
      process.exit(-1)
    }

    var N = packages.length
    console.log('\nPackages matching \"' + dependency + '\": (' + N + ')\n')

    packages.forEach(function (pkg) {
      console.log('Package name: ' +  pkg.name + ' \u21E2  ' + pkg.description)

      var registryURL = 'https://registry.npmjs.org/' + pkg.name + '\n'
      console.log('Registry URL: ', registryURL)
    })
    console.log('')
})