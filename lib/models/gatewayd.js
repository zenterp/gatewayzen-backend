var Sequelize = require('sequelize');
var database  = require(__dirname+'/../../db/connection');

var Gatewayd = database.define('Gatewayd', {
  name: Sequelize.STRING,
  public_ip: Sequelize.STRING,
  ripple_address: Sequelize.STRING,
  user_id: Sequelize.STRING,
  ec2_keypair_id: Sequelize.STRING,
  s3_keypair_id: Sequelize.STRING,
  ec2_instance_id: Sequelize.STRING,
  api_key: Sequelize.STRING,
  state: Sequelize.STRING
},{
  tableName: 'gatewayds',
  underscored: true
});

module.exports = Gatewayd;

