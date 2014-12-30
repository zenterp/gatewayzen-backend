
module.exports = {

  perform: function(gatewayId, callback) {
		console.log('gatewaydId', gatewayId);
		callback(null, gatewayId);
  }
}

