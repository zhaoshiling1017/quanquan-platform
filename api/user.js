var validator = require('validator');
var _ = require('lodash');

var login = function(req, res, next) {
  var userName = validator.trim(req.body.userName);
  var password = validator.trim(req.body.password);
  if (!userName || !password) {
    return res.json({code:-1, message:"手机号或密码不能为空"});
  }
  res.json({code:0, message:""});
}

exports.login = login;
