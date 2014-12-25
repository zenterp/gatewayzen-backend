var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {

  db.createTable('gatewayds', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    state:  {
      type: 'string',
      notNull: true
    },
    name: {
      type: 'string',
      notNull: true,
      unique: true
    },
    public_ip: {
      type: 'string',
      unique: true
    },
    ripple_address: {
      type: 'string',
      unique: true
    },
    ec2_keypair_id: {
      type: 'string'
    },
    s3_keypair_id: {
      type: 'string'
    },
    api_key: {
      type: 'string'
    }
  }, callback);
};

exports.down = function(db, callback) {

  db.dropTable('gatewayds', callback);
};

