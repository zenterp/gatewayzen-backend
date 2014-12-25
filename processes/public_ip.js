var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client.js');
var Worker = require('sql-mq-worker');
var ec2 = new EC2Client();

var worker = new Worker({
  Class: Gateway, 
  predicate: {
    where: { state: 'public_ip' }
  },
  job: attachPublicIp
});

worker.start();

function attachPublicIp(gateway, callback){
  ec2.describeInstance(gateway.ec2_instance_id, function(err, instance){
    if (err) { callback(err); return };
    if ('PublicIpAddress' in instance) {
      gateway.state = 'api_key';
      gateway.public_ip = instance.PublicIpAddress;
      gateway.save().complete(callback);
    } else {
      callback('no public ip');
    }
  }); 
}

