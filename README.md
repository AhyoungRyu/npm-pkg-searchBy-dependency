# npm-pkg-searchBy-dependency

You can fetch a list of packages from [NPM Registry](http://registry.npmjs.org/) with specified dependencies.
It queries using `npm-registry-client` and will return all packages which has `some_dependency` using the CouchDB view `dependedUpon`.

### Install
```
npm install npm-pkg-searchBy-dependency --save
```

### Test 
```
$ npm test 'dependency_name'

e.g. 
$ npm test zeppelin-vis
Querying https://registry.npmjs.org/-/_view/dependedUpon?startkey=%5B%22zeppelin-vis%22%5D&endkey=%5B%22zeppelin-vis%22%2C%7B%7D%5D&group_level=3
Packages matching "zeppelin-vis": (2)

Package name: zeppelin-bubblechart ⇢  Animated bubble chart
Registry URL:  https://registry.npmjs.org/zeppelin-bubblechart

Package name: zeppelin-highcharts-spline ⇢  Draw spline graph using Highcharts library
Registry URL:  https://registry.npmjs.org/zeppelin-highcharts-spline

...

```

### How to use?
```
var pkgSearchByDependency = require('npm-pkg-searchBy-dependency')

pkgSearchByDependency('my-plugin', function (error, packages) {
  packages.forEach(function (pkg) {
    console.log(pkg.name + ': ' + pkg.description)
  })
})
```

You can also pass an alternative registry URL:
```
var opts = {
  // e.g. if you want to search only latest version of pkg
  registryURL: 'https://registry.npmjs.org/' + pkg.name + 'latest',
  dependency: 'my-plugin',
  debug: true
}

pkgSearchByDependency(opts, function (error, packages) {
    packages.forEach(function (pkg) {
        console.log(pkg.name + ': ' + pkg.description)
    })
})
```

> Referred [npm-keywordsearch](https://github.com/wires/npm-keywordsearch) :)



