var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client');

var ec2 = new EC2Client();

function pop(fn){

  Gateway.find({ where: ['ec2_instance_id IS NOT NULL', { public_ip: '' }] }).complete(function(err, gateway) {
    if (err) {
      fn(err, null); 
    } else {
      fn(null, gateway);
    }
  });

};

function work(fn) {
  pop(function(err, gateway) {
    if (err || !gateway) { setTimeout(function() { fn(fn); }, 3000); return; };
    ec2.describeInstance(gateway.ec2_instance_id, function(err, instance){
      if (err) { setTimeout(function() { fn(fn); }, 3000); return; };
      console.log(instance);

      if ('PublicIpAddress' in instance) {
        gateway.state = 'complete';
        gateway.public_ip = instance.PublicIpAddress;
        gateway.save().complete(function(){ fn(fn); });

      } else {
        if (err) { setTimeout(function() { fn(fn); }, 3000); return; };
      }

    }); 
  });
};

work(work);

