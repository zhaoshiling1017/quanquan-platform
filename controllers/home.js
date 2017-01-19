var config = require('../config');
var tools = require('../common/tools');

exports.index = function (req, res, next) {
  res.render('home/index', {});
};
