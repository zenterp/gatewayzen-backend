var NR   = require("node-resque");
var path = require('path');
var jobs = require('require-all-to-camel')(path.join(__dirname+'/jobs'));

function ResqueWorker(options) {
  if (!options.queues instanceof Array) {
    throw new Error('TypeError options.queues must be Array') 
  }
  this.queues = options.queues;
	this.connectionDetails = {
		host:      "127.0.0.1",
		password:  "",
		port:      6379,
		database:  0
	};
  if (options.connectionDetails) {
		this.connectionDetails = options.connectionDetails;
	}
};

ResqueWorker.prototype.start = function() {
	var scheduler = new NR.scheduler({connection: this.connectionDetails}, function(){
		scheduler.start();
	});
	var worker = new NR.worker({
    connection: this.connectionDetails,
    queues: this.queues
  },
  jobs,
  function(){
		worker.workerCleanup();
		worker.start();
	});

  worker.on('start', function() {
		console.log('start');
  });

	worker.on('poll', function(queue){
    console.log("worker polling " + queue);
  });

	worker.on('job', function(queue, job){
    console.log("working job " + queue + " " + JSON.stringify(job));
  });

	worker.on('reEnqueue', function(queue, job, plugin){
    console.log("reEnqueue job (" + plugin + ") " + queue + " " + JSON.stringify(job));
  });

	worker.on('success', function(queue, job, result){
    console.log("job success " + queue + " " + JSON.stringify(job) + " >> " + result);
  })

	worker.on('error', function(queue, job, error){
    console.log("job failed " + queue + " " + JSON.stringify(job) + " >> " + error);
  })

	worker.on('pause', function(){
    console.log("worker paused");
  })
	scheduler.on('start', function(){ console.log("scheduler started"); })
	scheduler.on('end',               function(){ console.log("scheduler ended"); })
	scheduler.on('error',             function(error){ console.log("scheduler error >> " + error); })
	scheduler.on('poll',              function(){ console.log("scheduler polling"); })
	scheduler.on('working_timestamp', function(timestamp){ console.log("scheduler working timestamp " + timestamp); })
	scheduler.on('transferred_job',    function(timestamp, job){ console.log("scheduler enquing job " + timestamp + " >> " + JSON.stringify(job)); })


};

module.exports = ResqueWorker;

