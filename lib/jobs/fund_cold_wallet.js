var Gatewayd = require(__dirname+'/../models/gatewayd.js');
var request = require('request');
var rippleWallet = require('ripple-wallet');
var rippleClient = require(__dirname+'/../ripple_client.js');

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


function handleGatewayd(gateway, callback){
	var address = gateway.toJSON().address;
	console.log('handle gateway');
  if (address) {
		rippleClient.checkAccountBalance(address, function(err, xrpBalance){
			callback('no address found for gateway', null);
    });
	}
}

module.exports = {
 
  perform: function(gatewayId, callback){
		Gatewayd.find({ 
			where: { id: gatewayId }
		}).complete(function(err, gateway){
			if (err) {
				handleError(err, callback);
			} else if (gateway) {
				handleGatewayd(gateway, callback);
			} else {
				callback('no gateway found', null);
			}
		});
  }
  
};

