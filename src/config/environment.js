var nconf = require('nconf');

nconf
  .file({ file: __dirname+'/config.json' })
  .env();

nconf.defaults({
  'NODE_ENV': 'development'
});

var DBConfigFile = require(__dirname+'/database.json');
var dbConfig = DBConfigFile[nconf.get('NODE_ENV')];

nconf.set('DATABASE_USER', dbConfig.user);
nconf.set('DATABASE_PASSWORD', dbConfig.password);
nconf.set('DATABASE_NAME', dbConfig.database);
nconf.set('DATABASE_HOST', dbConfig.host);
nconf.set('DATABASE_PORT', dbConfig.port);
nconf.set('DATABASE_DIALECT', dbConfig.dialect);
nconf.set('DATABASE_LOGGING', dbConfig.logging);
nconf.set('DATABASE_URL', null);

module.exports = nconf;

