var path      = require('path')
var EC2Client = require(path.join(__dirname, '/../lib/ec2_client'))

module.exports = {

  perform: function(gatewayId, callback) {
    var client = new EC2Client()
    var instance;

    client.createInstance()
      .then(function(created) {
        console.log('created instance!', created)

        return client.addTag(created['InstanceId'], 'Name', 'gatewayzen:gatewayd')
      })
      .then(function() {
        callback(null, instance)
      })
      .error(function(error) {
        console.log('error creating instance!', error)
        callback(error)
      })
  }
}

