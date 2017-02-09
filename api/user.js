var validator = require('validator');
var _ = require('lodash');
var tools = require('../common/tools');
var cache = require('../common/cache');
var logger = require('../common/logger').logger('user');
var moment = require('moment');
var config = require('../config');
var User = require('../proxy').User;
var Promise = require('bluebird');
var smsUtil = require('../common/sms');
var join = Promise.join;

var regist = function(req, res, next) {
  var buildVersion = req.get('Build-Version');
  var version = req.get('Version');
  var requestId = req.get('X-Request-Id');
  var address = req.get('Address');
  var user_agent = req.get('User-Agent');
  var timestamp = req.get('Timestamp');
  var authorization = req.get('Authorization');
  var iv = req.get('Offset');
  var userId = req.get('User-Id');
  var data = req.body.data;
  logger.info("[%s]: user-agent<%s>, timestamp<%s>, authorization<%s>, data<%s>, iv<%s>, userId<%s>", "user::regist", user_agent, timestamp, authorization, data, iv, userId);
  if (!timestamp && tools.dateDiff(parseInt(timestamp + '000'), moment()) > config.requst_expire) {
    return next();
  }
  var key = timestamp + timestamp.substr(2, 6);
  var jsonData = JSON.parse(tools.decrypt(key, data, iv));
  timestamp = tools.genTimestamp();
  key = timestamp + timestamp.substr(2, 6);
  var tooken = tools.genOauthNonce();
  iv = tools.generateRand(16);
  authorization = tools.encrypt(key, tooken, iv);
  key = tooken.substr(0, 16);
  res.set('Timestamp', timestamp);
  res.set('Authorization', authorization);
  res.set('Offset', iv);
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
    user.save().then(function(user_tmp) {
      res.set("User-Id", user_tmp.id);
      var result = {code: code, message: message, data: {username: userName, id: user_tmp.id}};
      data = tools.encrypt(key, JSON.stringify(result), iv);
      res.json({data: data});
    });
  } else {
    res.set("User-Id", userId);
    var result = {code: code, message: message, data: ''};
    data = tools.encrypt(key, JSON.stringify(result), iv);
    res.json({data: data});
  }
}

exports.regist = regist;


var randVerifyCode = function(req, res, next) {
  var timestamp = req.get('Timestamp');
  var authorization = req.get('Authorization');
  var iv = req.get('Offset');
  var requestId = req.get('X-Request-Id');
  var data = req.body.data;
  var code = 0;
  var message = '';
  logger.info("[%s]: timestamp<%s>, authorization<%s>, iv<%s>, data<%s>", "user::regist", timestamp, authorization, iv, data);
  if (!timestamp && tools.dateDiff(parseInt(timestamp + '000'), moment()) > config.requst_expire) {
    return next();
  }
  var key = timestamp + timestamp.substr(2, 6);
  data = tools.decrypt(key, data, iv);
  console.log(data);
  //data = data.replace(/&quot;/g, '"');
  var jsonData = JSON.parse(data);
  var type = jsonData.type;
  var phone = jsonData.phone;
  timestamp = tools.genTimestamp();
  key = timestamp + timestamp.substr(2, 6);
  var tooken = tools.genOauthNonce();
  iv = tools.generateRand(16);
  authorization = tools.encrypt(key, tooken, iv);
  key = tooken.substr(0, 16);
  res.set('Timestamp', timestamp);
  res.set('Authorization', authorization);
  res.set('Offset', iv);
  var result = {};
  User.getUserByPhone(phone).then(function(user) {
    if (type == '0' && user != null) {
      code = -1;
      message = '手机号码已注册';
    }
    if (type == '1' && user == null) {
      code = -1;
      message = '手机号码不存在';
    }
    if (code == -1) {
      result = {code: code, message: message, data: ''};
      data = tools.encrypt(key, JSON.stringify(result), iv);
      return res.json({data: data});
    }
    var vCode = tools.generateVerifyCode();
    var content = config.sms.verifyCode_content.replace("{code}", vCode) + config.sms.signature;
    smsUtil.sendMessage(phone, content, function(err, rs) {
      if (err) {
        code = -1;
        message = '短信发送失败';
        logger.error("[%s]: phone<%s>, content<%s>, message<%s>", "user", phone, content, err.toString());
      } else {
        rs = JSON.parse(decodeURIComponent(rs));
        if (!(rs.returnstatus != null && rs.returnstatus == 'Success')) {
          logger.info("[%s]: phone<%s>, content<%s>, message<%s>", "user", phone, content, "短信发送失败");
          code = -1;
          message = '短信发送失败';
        } else {
          logger.info("[%s]: phone<%s>, content<%s>, message<%s>", "user", phone, content, "短信发送成功");
          message = '短信发送成功';
          cache.setex('SYS_RAND_' + phone, 60 * 5, vCode);
        }
      }
      result = {code: code, message: message, data: ''};
      data = tools.encrypt(key, JSON.stringify(result), iv);
      res.json({data: data});
    });
  });
}

exports.randVerifyCode = randVerifyCode;
