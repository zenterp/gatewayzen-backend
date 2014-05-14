var AWS = require('aws-sdk');

AWS.config.loadFromPath(__dirname + '/../config/aws.json');

var s3 = new AWS.S3();

function S3Client() {};

S3Client.prototype.getSshKey = function(name, fn){
  s3.getObject({ Bucket: 'zen-gateways', Key: name }, function(err, data){
    if (err){ fn(err, null); return; };
    fn(null, data.Body);
  });
};

module.exports = S3Client;

