var SSH = require('ssh2');

function Shell(options){
  this.host = options.host;
  this.privateKey = options.privateKey;
  this.databaseUrl = 'postgres://postgres:password@localhost:5432/ripple_gateway';
  this.shell = new SSH();
}

Shell.prototype.exec = function(command, fn){
  var shell = this.shell;
  var self = this;
  shell.connect({
    host: self.host,
    privateKey: self.privateKey,
    port: 22,
    username: "ubuntu", 
    agentForward: true,
    readyTimeout: 20000
  });
  shell.on('error', function(err) {
    fn(err, null);
  });
  shell.on('ready', function() {
    shell.exec('DATABASE_URL='+self.databaseUrl+' '+command, function(err, stream){
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

module.exports = Shell;

