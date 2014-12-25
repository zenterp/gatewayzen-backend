var Gateway = require(__dirname+'/../lib/models/gateway.js');
var S3Client = require(__dirname+'/../lib/s3_client.js');
var Shell = require(__dirname+'/../lib/shell.js');
var Worker = require('sql-mq-worker');

var s3 = new S3Client();

var worker = new Worker({ 
  Class: Gateway, 
  predicate: {
    where: { state: 'api_key' }
  },
  job: attachApiKeyToGateway
});

worker.start();

function attachApiKeyToGateway(gateway, callback){
  s3.getSshKey(gateway.s3_keypair_id, function(err, key){
    if (err) { callback(err); return };
    ssh = new Shell({
      host: gateway.public_ip,
      privateKey: new Buffer(key)
    });
    ssh.exec('/home/ubuntu/gatewayd/bin/gateway get_key', function(err, apiKey){
      if (err) { callback(err); return };
      gateway.api_key = apiKey;
      gateway.save().complete(function(){
        callback(null, apiKey);
      });
    });
  });
}

