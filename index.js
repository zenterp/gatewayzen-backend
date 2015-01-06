var path               = require('path')
var BridgesApplication = require('bridges-application')
var fs                 = require('fs')

var application = new BridgesApplication({
  directory : __dirname
})

application.supervisor.start().then(function() {

  console.log('started bridges application supervisor')
})

