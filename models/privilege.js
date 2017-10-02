(function () {'use strict';})();
module.exports = function(sequelize, Sequelize) {
  var Privilege = sequelize.define('Privilege', {
  id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },    
    description: {
        type: Sequelize.STRING,
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
  return Privilege;
};