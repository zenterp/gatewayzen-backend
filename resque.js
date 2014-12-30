var NR = require("node-resque");
var ResqueWorker = require(__dirname+'/../');

var connectionDetails = {
  host:      "127.0.0.1",
  password:  "",
  port:      6379,
  database:  0,
}

var jobs = {
  "setColdWallet": require(__dirname+'/lib/jobs/set_cold_wallet.js'),
  "fundColdWallet": require(__dirname+'/lib/jobs/fund_cold_wallet.js')
};

var scheduler = new NR.scheduler({connection: connectionDetails}, function(){
  scheduler.start();
});
var worker = new ResqueWorker({
  queues: ['gateway']
});

worker.start();

scheduler.on('start',             function(){ console.log("scheduler started"); })
scheduler.on('end',               function(){ console.log("scheduler ended"); })
scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); })
scheduler.on('poll',              function(){ console.log("scheduler polling"); })
scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); })
scheduler.on('transferred_job',    function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); })

var queue = new NR.queue({connection: connectionDetails}, jobs, function(){
	queue.enqueue('gateway', 'setColdWallet', [2]);
  queue.enqueue('gateway', 'fundColdWallet', [2]);
});

