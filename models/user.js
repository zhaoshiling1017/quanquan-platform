"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false
    },
    user_name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true
  });
  return User;
};
