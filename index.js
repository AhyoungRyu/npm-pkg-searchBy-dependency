var RegClient = require('silent-npm-registry-client')
var stream = require('stream')
var stringify = require('json-stringify-pretty-compact')

var npmPkgSearchByDependency = require('./npmPkgSearchByDependency')
var dependency = 'zeppelin-vis'

//define S3 modules
var AWS = require('aws-sdk')
var s3 = new AWS.S3(
  {
    signatureVersion: 'v4' // need to convert v2 -> v4 to avoid conflict
  }
);

/*
  This file is main for AWS Lambda function
 */
exports.handler = (event, context, callback) => {
  var bucketName = 'helium-package'

  npmPkgSearchByDependency(dependency, function (error, packages) {
    if (error) {
      console.error(error)
      process.exit(-1)
    }

    var N = packages.length
    var uriList = []
    var params = { timeout: 1000 }
    var client = new RegClient({logstream: new stream.Writable()})
    var type = 'VISUALIZATION'

    console.log('\nPackages matching \"' + dependency + '\": (' + N + ')\n')

    // get each package's url
    packages.forEach(function (pkg) {
      var registryURL = 'https://registry.npmjs.org/' + pkg.name + '/latest'
      uriList.push(registryURL)
    })
    console.log('')

    var finalResult = []
    var iter = N
    uriList.forEach(function (uri) {
      client.get(uri, params, function (error, data) {
        if (error) {
          return callback(error)
        }

        /* get each package info
         1. type: 'VISUALIZATION'
         2. name: pkg name
         3. description: pkg description
         4. artifact: name@version (_id)
         5. license: license type
         6. icon: user needs to set the icon in package.json. Default: <i class="fa fa-plug">
         */
        var result = {
          type: type,
          name: data.name,
          description: data.description,
          artifact: data._id,
          license: data.license,
          icon: (data.icon == undefined) ? '<i class="fa fa-plug"></i>' : data.icon
        }

        console.log(stringify(result))

        // TYPE1. upload each helium pkg info file
        var paramForEachFile = {
          Bucket: bucketName,
          Key: data.name + '.json',
          Body: stringify(result)
        }

        console.log(paramForEachFile)

        s3.putObject(paramForEachFile, function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        })

        // TYPE2. upload 'helium.json' which has all integrated info as one json array
        finalResult.push(result)

        if (N < iter) {
          console.log(stringify(finalResult))

          var paramForIntegratedFile = {
            Bucket: bucketName,
            Key: 'helium.json',
            Body: stringify(finalResult)
          }

          console.log(paramForIntegratedFile)

          s3.putObject(paramForIntegratedFile, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);

            context.callbackWaitsForEmptyEventLoop = false;
            callback(null, 'Success message')
          })
        }
        iter++
      })
    })
  })
};