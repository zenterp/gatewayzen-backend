var NR           = require("node-resque")
var path         = require('path')
var ResqueWorker = require(path.join(__dirname, '/../lib/resque_worker'))
var ResqueQueuer = require(path.join(__dirname, '/../lib/resque_queuer'))
var requireAll   = require('require-all-to-camel')
var jobs 	       = requireAll(path.join(__dirname, '/../jobs'))

module.exports = function() {

  var worker = new ResqueWorker({
    queues: ['gatewayzen']
  })

  worker.start()

  var queuer = new ResqueQueuer()

  queuer.start().then(function(queue) {

    // queue.enqueue('gatewayzen', 'initializeEc2Instance', [1])
  })
}

