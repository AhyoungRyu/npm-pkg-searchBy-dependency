var argv = require('minimist')(process.argv.slice(2))
var stringify = require('json-stringify-pretty-compact')
var npmPkgSearchByDependency = require('./npmPkgSearchByDependency')

/*
 If it didn't get any args, will search packages which have 'zeppelin-vis zeppelin-spell' by default
 command: npm test 'any_dependencies' (e.g. 'babel-core')
*/
var depList = ['zeppelin-vis', 'zeppelin-spell']
var dependency = (argv._.length === 0) ? depList : argv._

dependency.forEach( function (dep) {
  npmPkgSearchByDependency(dep, function (error, packages) {
    if (error) {
      console.error(error)
      process.exit(-1)
    }

    console.log('\nPackages matching \"' + dep + '\": (' + packages.length + ')\n')

    packages.forEach(function (pkg) {
      console.log('Package name: ' +  pkg.name + ' \u21E2  ' + pkg.description)
      console.log('Registry URL: ', pkg.uri)
    })
    console.log('')
  })
})