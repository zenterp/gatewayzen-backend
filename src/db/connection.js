var Sequelize = require('sequelize');
var pg        = require('pg');
var config    = require(__dirname+'/../config/environment');

var dbOptions = {
  dialect: config.get('DATABASE_DIALECT'),
  host: config.get('DATABASE_HOST'),
  port: config.get('DATABASE_PORT'),
  logging: config.get('DATABASE_LOGGING')
};

module.exports = new Sequelize(config.get('DATABASE_NAME'),
                       config.get('DATABASE_USER'),
                       config.get('DATABASE_PASSWORD'),
                       dbOptions);

