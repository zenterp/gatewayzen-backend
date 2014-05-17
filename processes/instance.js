var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client');

var ec2 = new EC2Client();

function getGatewayNeedingInstance(fn) {
  Gateway.find({ where: { ec2_instance_id: '' }}).complete(function(err, gateway) {
    if (err) {
      fn(err, null); 
    } else {
      fn(null, gateway);
    }
  });
};

function attachInstanceToGateway(gateway, fn){
  ec2.createInstance(function(err, instance){
    if (err) {
      handleError(err, fn); return;
    }
    gateway.ec2_instance_id = instance.InstanceId;
    gateway.state = 'confirm_instance';
    gateway.save().complete(function(){
      fn(null, instance);
    });
  }); 
}

function handleError(err, fn){
  if (err) { console.log('error', err) };
  setTimeout(function() {
    fn(fn);
  }, 1000);
}

function work(fn) {

  getGatewayNeedingInstance(function(err, gateway) {
    if (err || !gateway) { 
      handleError(err, fn); return;
    }

    attachInstanceToGateway(gateway, function(err, instance){ 
      if (err) { handleError(err, fn); return; };

      console.log(instance);
      fn(fn);
    });
  });
};

work(work);

