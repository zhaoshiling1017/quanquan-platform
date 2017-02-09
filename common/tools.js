var bcrypt = require('bcrypt');
var moment = require('moment');
var config = require('../config');
var _ = require('lodash');
var validator = require('validator');
moment.locale('zh-cn'); // 使用中文
var logger = require('./logger').logger('tools');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);
var crypto = require('crypto');
var uuid = require('uuid');

// 格式化时间
var formatDate = function (date, friendly) {
  date = moment(date);
  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm:ss');
  }
};

exports.formatDate = formatDate;
//获取毫秒差
var getDateDiff = function (beginAt, endAt) {
  var date = moment(endAt);
  return date.diff(beginAt);
}
exports.dateDiff = getDateDiff;

//将毫秒转换成HH:mm:ss格式
var timeFomart = function (duration) {
  var hour = parseInt(duration/(1000*60*60));
  var time = duration - hour * (1000*60*60);
  var minute = parseInt(time/(1000*60));
  time = time - minute * (1000*60);
  var second = parseInt(time/1000);
  return leftJoin(hour, 2, '0') + ':' + leftJoin(minute, 2, '0') + ':' + leftJoin(second, 2, '0');
}
exports.timeFomart = timeFomart;

//字符串拼接
var leftJoin = function (str, scale, val) {
  var len = String(str).length;
  logger.info('leftJoin:: str<%s>, scale<%s>, val<%s>, len<%s>', str, scale, val, len);
  if (len < scale) {
    var diff = scale - len;
    var prefix = "";
    for (var i = 0; i < diff; i++) {
      prefix += val;
    }
      str = prefix + str;
  }
  return str;
}
exports.leftJoin = leftJoin;

var validateId =  function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.validateId = validateId;

var validatePhone = function (str) {
  if (_.isEmpty(str)) {
    return true;
  }
  return (/^([0-9]{3,4}-?)?[0-9]{7,8}$/).test(str);
}

exports.validatePhone = validatePhone;

var validateMobile = function (str) {
  if (_.isEmpty(str)) {
    return true;
  }
  return (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test(str);
}

exports.validateMobile = validateMobile;

exports.bhash = function (str) {
  return bcrypt.hashAsync(str, 10);
};

exports.bcompare = function (str, hash) {
  return bcrypt.compareAsync(str, hash);
};

exports.genSession = function(user, res) {
  var auth_token = user.id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  res.cookie(config.auth_cookie_name, auth_token,
    {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true}); //cookie 有效期30天
}

var filterEmptyKey = function (obj) {
  var other = {};
  var keys = _.keys(obj);
  for (var i=0; i<keys.length; i++) {
    var key = keys[i];
    obj[key] = validator.trim(obj[key]);
    if (!_.isEmpty(obj[key])) {
      other[key] = obj[key];
    }
  }
  return other;
}

exports.filterEmptyKey = filterEmptyKey;


var trim = function(str) {
  return validator.trim(str);
}

exports.trim = trim;

var trimOrDefault = function(str, defaultValue) {
  str = validator.trim(str);
  if (_.isEmpty(str)) {
    return defaultValue;
  }
  return str;
}

exports.trimOrDefault = trimOrDefault;

var trimObject = function (obj) {
  var keys = _.keys(obj);
  for (var i=0; i<keys.length; i++) {
    var key = keys[i];
    obj[key] = validator.trim(obj[key]);
  }
  return obj;
}

exports.trimObject = trimObject;

var encrypt = function (key, data, iv) {
  var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  var crypted = cipher.update(data, 'utf8', 'binary');
  crypted += cipher.final('binary');
  crypted = new Buffer(crypted, 'binary').toString('base64');
  return crypted;
};

exports.encrypt = encrypt;

var decrypt = function (key, crypted, iv) {
  crypted = new Buffer(crypted, 'base64').toString('binary');
  var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  var decoded = decipher.update(crypted, 'binary', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
};

exports.decrypt = decrypt;

var genOauthNonce = function() {
  var oauth_nonce = uuid().replace(/-/g, '');
  return oauth_nonce;
}

exports.genOauthNonce = genOauthNonce;

var genTimestamp = function() {
  return parseInt(moment().valueOf()/1000) + '';
}

exports.genTimestamp = genTimestamp;

var generateRand = function(n) {
  var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var res = "";
  for(var i = 0; i < n ; i ++) {
      var id = Math.ceil(Math.random()*35);
      res += chars[id];
  }
  return res;
}

exports.generateRand = generateRand;

var generateVerifyCode = function() {
  var num = "";
  for (var i=0; i<4; i++) {
    num += Math.floor(Math.random()*10);
  }
  return num;
}

exports.generateVerifyCode = generateVerifyCode;
