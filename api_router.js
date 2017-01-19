var express           = require('express');
var userController    = require('./api/user');
var middleware        = require('./api/middleware');
var config            = require('./config');

var router            = express.Router();

module.exports = router;
