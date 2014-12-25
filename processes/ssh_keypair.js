var Gateway = require(__dirname+'/../lib/models/gateway.js');
var EC2Client = require(__dirname+'/../lib/ec2_client.js');
var S3Client = require(__dirname+'/../lib/s3_client.js');
var Worker = require('sql-mq-worker');

var ec2 = new EC2Client();
var s3 = new S3Client();

var worker = new Worker({
  Class: Gateway, 
  predicate: {
    where: { state: 'ssh_keypair' }
  },
  job: attachKeypairToGateway
});

worker.start();

function attachKeypairToGateway(gateway, callback){
  createKeypair(function(err, keypair){
    if (err){ callback(err); return; };
    gateway.ec2_keypair_id = keypair.KeyName;
    gateway.state = "instance";
    gateway.save().complete(callback);
  });
}

function createKeyPair(fn){
  ec2.createKeypair(function(err, keypair){
    if (err) { console.log('error', err); fn(err,null); return; }
    s3.putSshKey(keypair, function(err, s3Object){
      if (err) { console.log('error', err); fn(err,null); return; }
      fn(null, keypair);
    });
  }); 
}

