var config = require('../config');
var logger = require('./logger').logger('sms');
var HttpClient = require('./http_client');

var sendMessage = function(mobile, content, callback) {
  var params = {};
  var url = config.sms.serviceURL;
  var account = config.sms.account;
  var password = config.sms.password;
  params.account = account;
  params.password = password;
  params.mobile = mobile;
  params.content = content;
  var client = new HttpClient(url);
  client.post(params, callback);
}

exports.sendMessage = sendMessage;
