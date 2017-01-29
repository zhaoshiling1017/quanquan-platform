var validator = require('validator');
var _ = require('lodash');
var tools = require('../common/tools');
var logger = require('../common/logger').logger('user');
var moment = require('moment');
var config = require('../config');
var User = require('../proxy').User;
var Promise = require('bluebird');
var join = Promise.join;

var regist = function(req, res, next) {
  var user_agent = validator.trim(req.get('user-agent'));
  var token_param = validator.trim(req.get('token-param'));
  var token_data = validator.trim(req.get('token-data'));
  var data = req.body.data;
  var iv = validator.trim(req.get('trans-offset'));
  var userId = validator.trim(req.get('user-id'));
  logger.info("[%s]: user-agent<%s>, token-param<%s>, token_data<%s>, data<%s>, iv<%s>, userId<%s>", "user::regist", user_agent, token_param, token_data, data, iv, userId);
  // if (!token_param && tools.dateDiff(parseInt(token_param + '000'), moment()) < config.requst_expire) {
  //   var key = token_param + token_param.substr(2, 6);
  //   logger.info("key<%s>", key);
  //   //var obj = tools.decodeCipher(key, data);
  //
  // }
  var key = token_param + token_param.substr(2, 6);
  var jsonData = JSON.parse(tools.decrypt(key, data, iv));
  token_param = tools.genTimestamp();
  key = token_param + token_param.substr(2, 6);
  var tooken = tools.genOauthNonce();
  iv = tools.generateRand(16);
  token_data = tools.encrypt(key, tooken, iv);
  key = tooken.substr(0, 16);
  res.set('token-param', token_param);
  res.set('token-data', token_data);
  res.set('trans-offset', iv);
  var userName = validator.trim(jsonData.username);
  var password = validator.trim(jsonData.password);
  logger.info("[%s]: username<%s>, password<%s>", "user::regist", userName, password);
  var code = 0;
  var message = '';
  if (!userName || !password) {
    code = -1;
    message = '用户名或密码不能为空';
  }
  if (!tools.validatePhone(userName)) {
    code = -1;
    message = '手机号码格式不正确';
  }
  if (code == 0) {
    var user = User.buildUser({user_name: userName, password: password, token: tooken});
    var password = tools.bhash(user.password);
    join(password, function(password) {
      user.password = password;
      user.save().then(function(user_tmp) {
        res.set("user-id", user_tmp.id);
        var result = {code: code, message: message, data: {username: userName}};
        data = tools.encrypt(key, JSON.stringify(result), iv);
        res.json({data: data});
      });
    });
  } else {
    res.set("user-id", userId);
    var result = {code: code, message: message};
    data = tools.encrypt(key, JSON.stringify(result), iv);
    res.json({data: data});
  }
}

exports.regist = regist;
