var forever = require('forever-monitor');

var processNames = [
  'instance',
  'server'
];

processNames.forEach(function(name) {

  var child = new (forever.Monitor)(__dirname+'/processes/'+name+'.js', {
    max: 100,
    silent: false,
    options: []
  });

  child.on('exit', function () {
    console.log(name + ' process has exited after 100 restarts');
  });

  child.start();
});


