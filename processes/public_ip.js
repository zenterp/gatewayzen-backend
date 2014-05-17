var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client.js');
var SequelizeQueueWorker = require(__dirname'/../lib/poller.js');
var ec2 = new EC2Client();

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


var worker = new SequelizeQueueWorker({ 
  Class: Gateway, 
  predicate: {
    where: { state: 'public_ip' }
  },
  job: attachPublicIp
});

worker.start();


work(work);

