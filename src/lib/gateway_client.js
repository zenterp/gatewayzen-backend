var request = require('superagent');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function GatewayClient(ipAddress, username, password) {
  this.ipAddress = ipAddress;
	this.username = username;
  this.password = password;
};

GatewayClient.prototype = Object.create(Object.prototype);
GatewayClient.prototype.constructor = GatewayClient;

GatewayClient.prototype.get = function(uri, error, success) {
  request  
    .get('https://'+this.ipAddress+uri)
    .auth(this.username, this.password)
    .end(function(err, resp){
	    if (err) {
			  error(err);
	  	} else {
				success(resp);
  		}
   });
};

GatewayClient.prototype.post = function(uri, params, error, success) {
  request  
    .post('https://'+this.ipAddress+uri)
		.send(params || {})
    .auth(this.username, this.password)
    .end(function(err, resp){
	    if (err) {
			  error(err);
	  	} else {
				success(resp);
  		}
   });
};

GatewayClient.prototype.getColdWallet = function(callback) {
  this.get('/v1/config/wallets/cold', callback, function(resp){
		callback(null, resp.body.COLD_WALLET.address);
	});
};

GatewayClient.prototype.getHotWallet = function(callback) {
  this.get('/v1/config/wallets/hot', callback, function(resp){
		callback(null, resp.body);
	});
};

GatewayClient.prototype.getDomain = function(callback) {
  this.get('/v1/config/domain', callback, function(resp){
		callback(null, resp.body);
	});
};

GatewayClient.prototype.setDomain = function(domain, callback) {
  this.post('/v1/config/domain', { domain: domain }, callback, function(resp){
		callback(null, resp.body);
	});
};

module.exports = GatewayClient;

