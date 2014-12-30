var NR = require("node-resque");
var ResqueWorker = require(__dirname+'/lib/resque_worker');
var jobs 	       = require('require-all-to-camel')(__dirname+'/lib/jobs');

var connectionDetails = {
  host:      "127.0.0.1",
  password:  "",
  port:      6379,
  database:  0,
}

var worker = new ResqueWorker({
  queues: ['initializeEc2Instance']
});

worker.start();

console.log(jobs);

var queue = new NR.queue({connection: connectionDetails}, jobs, function(){
	queue.enqueue('initializeEc2Instance', 'initializeEc2Instance', 1);
	queue.enqueue('initializeEc2Instance', 'initializeEc2Instance', 2);
});

