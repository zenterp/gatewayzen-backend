var app = require(__dirname+'/../lib/application');
var Gatewayd = require(__dirname+'/../lib/models/gatewayd');

var port = process.env.PORT || 5000;

Gatewayd.sync().then(function() {
  app.listen(port, function() {
    console.log('Listening on port', port);
  });
});

