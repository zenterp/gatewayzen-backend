
var ResqueWorker = require(__dirname+'/../lib/resque_worker');

var worker = new ResqueWorker({
  queuess: ['initializeEc2Instance']
});

worker.start();

