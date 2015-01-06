var express  = require('express');
var router   = new express.Router();
var Gatewayd = require(__dirname+'/../lib/models/gatewayd');

router.get('/gatewayds', function(request, response, error) {

  Gatewayd.findAll().then(function(gatewayds) {
    response.status(200).send({
      gatewayds: gatewayds
    })
  })
  .error(function(error) {
    response.status(500).send({
      error: error
    });
  });
});

router.post('/gatewayds', function(request, response, error) {

  Gatewayd.create({
    name: request.body.name,
    state: 'new'
  })
  .then(function(gatewayd) {
    response.status(201).send({
      gatewayd: gatewayd
    })
  })
  .error(function(error) {
    response.status(500).send({
      error: error
    });
  })
})

module.exports = router;

