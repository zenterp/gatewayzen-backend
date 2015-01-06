var AWS     = require('aws-sdk')
var uuid    = require('uuid')
var Promise = require('bluebird')

AWS.config.loadFromPath(__dirname + '/../config/aws.json')

var ec2 = new AWS.EC2()

function EC2Client() {
  this.ami = 'ami-ddd499ed'
  this.size = 'm1.small'
  this.keyName = 'aws_oregon'
}

EC2Client.prototype.createInstance = function(){
  var _this = this
  return new Promise(function(resolve, reject) {
   var ec2Instance = {
      ImageId: _this.ami,
      MaxCount: 1,
      MinCount: 1,
      KeyName: _this.keyName
    }

    ec2.runInstances(ec2Instance, function(error, resp){
      if (error) { return reject(error) }

      if ('Instances' in resp) {
        resolve(resp.Instances[0])
      } else {
        reject(new Error('no instances found'))
      }
    })
  })
}

EC2Client.prototype.addTag = function(instanceId, key, value) {
  return new Promise(function(resolve, reject) {
    var tagsParams = {
      Resources: [ instanceId ],
      Tags: [{
        Key: key,
        Value: value
      }]
    }

    ec2.createTags(tagsParams, function(error, resp){
      if (error) { return reject(error) }
      resolve(resp)
    })
  })
}

EC2Client.prototype.describeInstance = function(instanceId, fn){

  var instances = {
    InstanceIds: [instanceId]
  }

  ec2.describeInstances(instances, function(err, resp){
    if (err) {
      fn(err, null)
    } else {
      try {
        fn(null, resp.Reservations[0].Instances[0])
      } catch(e) {
        fn(e, null)
      }
    }
  })

}

EC2Client.prototype.createKeyPair = function(fn){
  var params = {
    KeyName: uuid.v4(),
    DryRun: false,
  }
  ec2.createKeyPair(params, function(err, data) {
    if (err) {
      fn(err, null)
    } else {
      fn(null, data)
    }
  })
}

module.exports = EC2Client

