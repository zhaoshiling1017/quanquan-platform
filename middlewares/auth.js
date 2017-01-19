var config = require('../config');
var cache = require('../common/cache');
var _ = require('lodash');
var Promise = require('bluebird');

var notAuth = [
  '/signin'
];

// 验证用户是否登录
exports.authUser = function (req, res, next) {
  next();
};
