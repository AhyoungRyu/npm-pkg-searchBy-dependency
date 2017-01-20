var RegClient = require('silent-npm-registry-client')
var stream = require('stream')
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
  This file is main for the AWS Lambda
  Input: package's name, description, artifact(_id), license
  Where: helium-package S3 bucket
 */
exports.handler = (event, context, callback) => {
  var bucketName = 'helium-package'

  npmPkgSearchByDependency(dependency, function (error, packages) {
    if (error) {
      console.error(error)
      process.exit(-1)
    }

    var N = packages.length
    var callbackMsg = []
    var params = { timeout: 1000 }
    var client = new RegClient({logstream: new stream.Writable()})

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
          name: data.name,
          description: data.description,
          artifact: data._id,
          license: data.license
        }

        var parsedBody = JSON.stringify(result)

        // upload each file to S3 bucket
        var param = {
          Bucket: bucketName,
          Key: data.name + '.json',
          Body: parsedBody
        }

        console.log(param)

        s3.putObject(param, function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);

          context.callbackWaitsForEmptyEventLoop = false;
          callback(null, 'Success message')

        })
      })
    })
    console.log('')
  })
};