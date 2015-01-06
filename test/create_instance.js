var path         = require('path')
var ResqueWorker = require(path.join(__dirname, '/../src/lib/resque_worker'))
var ResqueQueuer = require(path.join(__dirname, '/../src/lib/resque_queuer'))

var queuer = new ResqueQueuer()

queuer.start().then(function(queue) {
  queue.enqueue('gatewayzen', 'initializeEc2Instance', [1])
  
  setTimeout(process.exit, 2000)
})

