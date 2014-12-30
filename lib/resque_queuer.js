var NR      = require('node-resque');
var Promise = require('bluebird');
var jobs    = require('require-all-to-camel')(__dirname+'/jobs');

function ResqueQueuer(options) {
  this.connectionDetails = {
		host:      "127.0.0.1",
		password:  "",
		port:      6379,
		database:  0,
	}
  if (options && options.connectionDetails) {
		this.connectionDetails = options.connectionDetails;
  }
}

ResqueQueuer.prototype.start = function() {
	var _this = this;
  return new Promise(function(resolve, reject) {
		var queue = new NR.queue({connection: _this.connectionDetails}, jobs, function() {
      console.log('queue connected');
      resolve(queue);
    });
  });
}

module.exports = ResqueQueuer;

