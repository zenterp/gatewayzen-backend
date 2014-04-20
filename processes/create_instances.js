var gateways = require(__dirname+'/../lib/gateways');


function pop(fn){

  gateways.find({ where: { state: 'ec2instance' }}, function(err, gateway) {
    if (err) {
      fn(err, null); 
    } else {
      fn(null, gateway);
    }
  });

};

function work(fn) {

  pop(function(err, gateway) {
    if (err) { setTimeout(function() { fn(fn); }, 500); return; };

    ec2.createInstance(function(err, instance){
      if (err) { setTimeout(function() { fn(fn); }, 500); return; };

      gateway.ec2_instance_id = instance.InstanceId;
      gateway.state = 'complete';
      gateway.save().complete(function(){ fn(fn); });

    }); 
  });
};

work(work);

