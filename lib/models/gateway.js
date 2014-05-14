var pg = require('pg');
var Sequelize = require('sequelize');

var databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  var match = databaseUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  var sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: false,
    native: true
  }); 
} else {
  throw new Error('DATABASE_URL env variable is required');
}

var Gateway = sequelize.define('Gateway', {
  name: Sequelize.STRING,
  public_ip: Sequelize.STRING,
  ripple_address: Sequelize.STRING,
  user_id: Sequelize.STRING,
  keypair_id: Sequelize.STRING,
  keypair_s3_id: Sequelize.STRING,
  ec2_instance_id: Sequelize.STRING,
  state: Sequelize.STRING
},{
  tableName: 'gateways',
  underscored: true
});

module.exports = Gateway;

