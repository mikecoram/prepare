(function () {'use strict';})();
module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define('User', {
  id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },    
    emailAddress: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};