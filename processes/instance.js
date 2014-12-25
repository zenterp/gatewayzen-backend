var Gatewayd = require(__dirname+'/../lib/models/gatewayd.js');
var EC2Client = require(__dirname+'/../lib/ec2_client');
var Worker = require('sql-mq-worker');

var ec2 = new EC2Client();

var worker = new Worker({ 
  Class: Gatewayd, 
  predicate: {
    where: { state: 'instance' }
  },
  job: attachInstanceToGatewayd
});

worker.start();

function attachInstanceToGatewayd(gateway, callback){
  console.log('ATTACH INSTANCE', gateway.toJSON());
  ec2.createInstance(function(err, instance){
    if (err) { callback(err); return };
    gateway.ec2_instance_id = instance.InstanceId;
    gateway.state = 'confirm_instance';
    gateway.save().complete(function(){
      callback(null, instance);
    });
  }); 
}

