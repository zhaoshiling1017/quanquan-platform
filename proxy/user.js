var User = require('../models').User;
var _ = require('lodash');
var Promise = require('bluebird');
var config = require('../config');
var Bluebird = require('bluebird');
var Sequelize = require("sequelize");

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: config.db.dialect
});

exports.createUser = function(user) {
  return User.create(user);
}

exports.buildUser = function(user) {
  return User.build(user);
}

exports.findOne = function(query) {
  return User.findOne(query);
}

exports.destroyUser = function (id, callback) {
  return User.findById(id).then(function(user){
    return user.update({deleted: true});
  });
}

exports.getUserById = function(id) {
  return User.findById(id);
}

exports.getUserByPhone = function(phone) {
  return User.findOne({ where: {phone: phone}});
}

exports.getAllUsers = function() {
  return User.findAll({deleted: false});
}
