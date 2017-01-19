"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    user_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
    }, {
    underscored: true
  });
  return User;
};
