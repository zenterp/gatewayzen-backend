var AWS = require('aws-sdk');
var uuid = require("uuid");

AWS.config.loadFromPath(__dirname + '/../config/aws.json');

var ec2 = new AWS.EC2();

function EC2Client() {
  this.ami = 'ami-7a7b9612';
  this.size = 'm1.small';
};

EC2Client.prototype.createInstance = function(keypairName, fn){

 var ec2Instance = {
    ImageId: this.ami,
    MaxCount: 1,
    MinCount: 1,
    KeyName: keypairName
  };

  ec2.runInstances(ec2Instance, function(err, resp){
    if (err) { fn(err, null); return; };
    if ('Instances' in resp) {
      fn(null, resp.Instances[0]);
    } else {
      fn('no instances found', null);
    }
  });

};

EC2Client.prototype.describeInstance = function(instanceId, fn){

  var instances = {
    InstanceIds: [instanceId]
  };

  ec2.describeInstances(instances, function(err, resp){
    if (err) {
      fn(err, null);
    } else {
      try {
        fn(null, resp.Reservations[0].Instances[0]);
      } catch(e) {
        fn(e, null);
      }
    }
  });

};

EC2Client.prototype.createKeyPair = function(fn){
  var params = {
    KeyName: uuid.v4(),
    DryRun: false,
  };
  ec2.createKeyPair(params, function(err, data) {
    if (err) {
      fn(err, null);
    } else {
      fn(null, data);
    }
  });
}

module.exports = EC2Client;

