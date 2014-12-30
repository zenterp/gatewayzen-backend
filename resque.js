var NR = require("node-resque");
var ResqueWorker = require(__dirname+'/lib/resque_worker');
var ResqueQueuer = require(__dirname+'/lib/resque_queuer');
var jobs 	       = require('require-all-to-camel')(__dirname+'/lib/jobs');

var worker = new ResqueWorker({
  queues: ['gatewayzen']
});

worker.start();

var queuer = new ResqueQueuer();

queuer.start().then(function(queue) {
	queue.enqueue('gatewayzen', 'initializeEc2Instance', [1]);
	queue.enqueue('gatewayzen', 'initializeEc2Instance', [2]);
	queue.enqueue('gatewayzen', 'initializeEc2Instance', [3]);
});

