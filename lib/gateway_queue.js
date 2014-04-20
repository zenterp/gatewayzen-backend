var AWS = require('aws-sdk');

AWS.config.loadFromPath(__dirname + '/../config/aws.json');

function GatewayQueue(url) {
  this.queueUrl = url || 'https://sqs.us-east-1.amazonaws.com/157289716073/zen_new_gateways';
  this.sqs = new AWS.SQS();
};

GatewayQueue.prototype.getJob = function(fn) {
  var params = {
    QueueUrl: this.queueUrl
  };
  this.sqs.receiveMessage(params, fn);
};

GatewayQueue.prototype.work = function(hook) {
  var queue = this;

  this.getJob(function(err, job) {
    if (err) {
      console.log('error:', err);
      setTimeout(queue.work(hook), 5000);
      return;
    }

    hook(job, function(err, resp) {

      if (err) {
        setTimeout(queue.work(hook), 5000);
      } else {
        if ('Messages' in job) {
          if (receiptHandle = job.Messages[0].ReceiptHandle) {;
            queue.remove(receiptHandle, function(err, resp){
              console.log('removed item from queue');
              console.log(err, resp);
              setTimeout(queue.work(hook), 5000);
            });  
          }
        } else {
          setTimeout(queue.work(hook), 5000);
        }
      }

    });
  });

};

GatewayQueue.prototype.remove = function(receiptHandle, fn) {
  var queue = this;
  var params = {
    QueueUrl: this.queueUrl,
    ReceiptHandle: receiptHandle
  };

  this.sqs.deleteMessage(params, fn);
}

GatewayQueue.prototype.send = function(job, fn) {

  var messageBody = job;

  if (typeof job != 'string') {
    messageBody = JSON.stringify(job);
  }

  this.sqs.sendMessage({
    MessageBody: messageBody,
    QueueUrl: this.queueUrl
  }, fn);

};

module.exports = GatewayQueue;

