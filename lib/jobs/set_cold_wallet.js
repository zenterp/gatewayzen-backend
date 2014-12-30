var Gateway = require(__dirname+'/../models/gatewayd.js');
var request = require('request');
var rippleLib = require('ripple-lib');
var rippleD = require(__dirname+'/../remote.js');
var rippleWallet = require('ripple-wallet');

/*
* @function setColdWallet
* @description Job to set cold wallet of a gateway,
* given it doesn't already exist in the database. If
* the cold wallet already exists in the database, print
* the cold wallet address
*
*/

function handleError(error, callback){
	console.log('error', error);
	callback(error, null);
}

function handleGateway(gateway, callback){
	var address = gateway.toJSON().address;
  if (address) {
		//rippleD.request_account_info
		console.log('gateway address already set', address);
		callback(null, address);
	} else {
		var wallet = rippleWallet.generate();
		console.log('new wallet generated:', wallet);
		callback(null, gateway);
	}
}

module.exports = {
 
  perform: function(gatewayId, callback){
		Gateway.find({ 
			where: { id: gatewayId }
		}).complete(function(err, gateway){
			if (err) {
				handleError(err, callback);
			} else if (gateway) {
				handleGateway(gateway, callback);
			} else {
				callback('no gateway found', null);
			}
		});
  }
  
};

