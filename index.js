var GatewayQueue = require(__dirname+'/lib/gateway_queue');
var DatabaseClient = require(__dirname+'/lib/gateways_database_client');
var AwsClient = require(__dirname+'/lib/aws_client');

var queue = new GatewayQueue();
var gateways = new DatabaseClient();
var aws = new AwsClient();

queue.work(function(job, loop){

  switch(job.action) {
  case 'keypair':
    gateways.find(job.gateway_id, function(err, gateway){
      if (err) {  
        setTimeout(loop, 1000);
        return;
      };
      awsClient.createKeypair(function(err, keypairId){
        gateway.keypairId = keypairId;
        gateway.save().complete(loop);
      });
    });
    break;
  case 'ec2instance':
    gateways.find(job.gateway_id, function(err, gateway){
      if (err) {  
        setTimeout(loop, 1000);
        return;
      };
      awsClient.createEc2Instance(keypairId, function(err, ec2InstanceId){
        gateway.ec2Instance = ec2InstanceId;
        gateway.save().complete(loop);
      });
    });
    break;
  default:
    console.log(job);
    setTimeout(loop, 1000);
  }

});

gateways.onNewGateway(function(gateway, fn) {

  var message = {
    gateway_id: gateway.id,
    action: 'keypair'
  };

  queue.send(message, function(err, resp){

    gateway.state = 'keypair';
    gateway.save().complete(fn);

  });

});

gateways.onNewKeypair(function(gateway, fn){

  var message = {
    gateway_id: gateway.id,
    action: 'attachEc2Instance'
  };

  queue.send(message, function(err, resp){

    gateway.state = 'ec2instance';
    gateway.save().complete(fn);

  });
   
});

gateways.onNewEc2Instance(function(gateway, fn){

  console.log('*************************'); 
  console.log('NEW EC2 INSTANCE CREATED!'); 
  console.log('-------------------------'); 
  console.log(gateway);

  gateway.state = 'built';
  gateway.save().complete(fn);
  
});


