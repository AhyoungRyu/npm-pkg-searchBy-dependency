var RegClient = require('silent-npm-registry-client')
var stream = require('stream')

module.exports = function getPkgFullInfo (uri) {
  var params = { timeout: 1000 }
  var client = new RegClient({logstream: new stream.Writable()})

  client.get(uri, params, function (error, data) {
    //retrieve only ["name", "description", "_id('artifact' in helium.json)"] from package.json
    var result = [
      data.name,
      data.description,
      data._id
    ];
    var test = JSON.parse(JSON.stringify(result).replace(/\'/g, ''))
    return test;
  })
}