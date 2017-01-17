var c = require('chalk')
var argv = require('minimist')(process.argv.slice(2))
var npmPkgSearchByDependency = require('../npmPkgSearchByDependency')

var dependency = (argv._.length === 0) ? 'gulp-plugin' : argv._[0]

npmPkgSearchByDependency(dependency, function (error, packages) {
  // bork on error
  if (error) {
    console.error(error)
    process.exit(-1)
  }

  // print it
  var N = packages.length
  console.log('Packages matching \"' + c.yellow(dependency) + '\": (' + N + ')\n')
  packages.forEach(function (pkg) {
    console.log(' ' + c.bold(pkg.name) + ' 🔌  ' + c.gray(c.italic(pkg.description)))
  })
  console.log('')
})
