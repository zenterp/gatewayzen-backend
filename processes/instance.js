var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client');
var SequelizeQueueWorker = require(__dirname+'/../lib/sequelize_queue_worker.js');

var ec2 = new EC2Client();

var worker = new SequelizeQueueWorker({ 
  Class: Gateway, 
  predicate: {
    where: { state: 'instance' }
  },
  job: attachInstanceToGateway
});

worker.start();

function attachInstanceToGateway(gateway, callback){
  ec2.createInstance(function(err, instance){
    if (err) { callback(err); return };
    gateway.ec2_instance_id = instance.InstanceId;
    gateway.state = 'confirm_instance';
    gateway.save().complete(function(){
      callback(null, instance);
    });
  }); 
}

