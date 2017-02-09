var config = require('../config');
var Redis = require('ioredis');
var client = new Redis(config.redis_port, config.redis_host);

module.exports = client;
