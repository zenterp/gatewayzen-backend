var path         = require('path')
var ResqueWorker = require(path.join(__dirname, '/../lib/resque_worker'))

module.exports = function() {

  new ResqueWorker({
    queues: ['gatewayzen']
  }).start()
}

