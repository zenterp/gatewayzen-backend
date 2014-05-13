var SSH = require('ssh2');

function Shell(host, privateKey){
  this.host = host;
  this.privateKey = privateKey;
  this.databaseUrl = 'postgres://postgres:password@localhost:5432/ripple_gateway';
  this.shell = new SSH();
}

Shell.prototype.exec = function(command, fn){
  var shell = this.shell;
  var that = this;
  shell.connect({
    host: this.host,
    port: 22,
    username: 'ubuntu',
    agentForward: true,
    privateKey: this.privateKey,
    readyTimeout: 20000
  });
  shell.on('error', function(err) {
    fn(err, null);
  });
  shell.on('ready', function() {
    shell.exec('DATABASE_URL='+that.databaseUrl+' '+command, function(err, stream){
      if (err) throw err;
      stream.on('data', function(data, extended) {
        if (extended == 'stderr'){
          fn(data.toString(), null);
        } else {
          fn(null, data.toString());
        }
      });
      stream.on('exit', function(code, signal) {
        shell.end();
      });
    });
  });
}

function getApiKey(host, privateKey, fn){
  var shell = new Shell(host, privateKey);
  shell.exec('/home/ubuntu/gatewayd/bin/gateway get_key', fn);
};

var privateKey = require('fs').readFileSync('/Users/stevenzeiler/.ssh/amazon_web_services.pem');

getApiKey('50.17.39.241', privateKey, function(err, apiKey){
  if (err) { console.log('Error', err); return; };
  console.log('API KEY', apiKey);
});

