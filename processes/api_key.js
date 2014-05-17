var Gateway = require(__dirname+'/../lib/models/gateway.js');
var S3Client = require(__dirname+'/../lib/s3_client.js');
var Shell = require(__dirname+'/../lib/shell.js');

var s3 = new S3Client();

function getGatewayNeedingApiKey(fn) {
  Gateway.find({ where: ["s3_keypair_id != ''", { api_key: '' }]})
    .complete(function(err, gateway) {
    if (err) {
      fn(err, null); 
    } else {
      fn(null, gateway);
    }
  });
};

function attachApiKeyToGateway(gateway, fn){
  s3.getSshKey(gateway.s3_keypair_id, function(err, key){
    if (err) { handleError(err, fn); return };
    ssh = new Shell({
      host: gateway.public_ip,
      privateKey: new Buffer(key)
    });
    ssh.exec('/home/ubuntu/gatewayd/bin/gateway get_key', function(err, apiKey){
      if (err) { handleError(err, fn); return };
      gateway.api_key = apiKey;
      gateway.save().complete(function(){
        fn(null, apiKey);
      });
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
  getGatewayNeedingApiKey(function(err, gateway) {
    if (err || !gateway) { handleError(err, fn); return; }
    attachApiKeyToGateway(gateway, function(err, apiKey){ 
      if (err) { handleError(err, fn); return; };
      console.log(apiKey);
      fn(fn);
    });
  });
};

work(work);

