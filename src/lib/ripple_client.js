var remote = require(__dirname+'/remote.js');
var rippleLib = require('ripple-lib');
var FUNDING_AMOUNT = rippleLib.Amount.from_human('40XRP');

function checkAccountBalance(account, callback){
  remote.connect(function(){
		remote.request_account_info(account, function(err, resp){
			remote.disconnect();
			if (err) {
				if (err.remote) {
					callback(err.remote.error, null);
				} else {
					callback(err, null);
				}
			} else {
				callback(null, resp.account_data.Balance / 1000000.0);
			}	
		});
  });
};

function sendXrp(account, amount, callback){
  remote.connect(function(){
		remote.set_secret(process.env.RIPPLE_ACCOUNT, process.env.RIPPLE_SECRET);
		var transaction = remote.transaction();
		transaction.payment({
			from: process.env.RIPPLE_ACCOUNT,
			to: account,
			amount: FUNDING_AMOUNT
		});
		transaction.submit(function(err, resp){
			remote.disconnect();
			callback(err, resp);
    });
  });
};

function fundAccount(account, callback){
  checkAccountBalance(account, function(err, balance){
    if (err === 'actNotFound'){
			sendXrp(account, 40, callback);
		} else {
			callback('account exists or other error', balance);
		}
	}); 
};

module.exports = {
  checkAccountBalance: checkAccountBalance,
	fundAccount: fundAccount
};

