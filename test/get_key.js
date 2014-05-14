var Shell = require(__dirname+'/../lib/shell.js');

if (process.argv.length != 4){
  console.log('USAGE: bin/execshell <host> <path-to-pem>');
  return;
}

var privateKey = require('fs').readFileSync(process.argv[3]);

ssh = new Shell({
  host: process.argv[2],
  privateKey: privateKey
});

ssh.exec('/home/ubuntu/gatewayd/bin/gateway get_key', function(err, data){
  console.log(data);
});

