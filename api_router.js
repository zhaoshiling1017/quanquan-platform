var express = require('express');
var User = require('./api/user');
var config = require('./config');

var router = express.Router();

//用户
router.post('/login', User.login);

module.exports = router;
