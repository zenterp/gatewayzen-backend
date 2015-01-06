var express    = require('express');
var bodyParser = require('body-parser');
var router     = require(__dirname+'/../config/routes');

var app = express();
app.use(bodyParser.json());
app.use('/api', router);

module.exports = app;

