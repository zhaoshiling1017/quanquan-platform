var express = require('express');
var User = require('./api/user');
var config = require('./config');

var router = express.Router();

//用户
router.post('/user', User.regist);

module.exports = router;
