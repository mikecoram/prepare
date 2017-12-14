'use strict';
module.exports = function(sequelize, DataTypes) {
  var Quiz = sequelize.define('Quiz', {
    finishedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    result: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    graded: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdOn: DataTypes.DATE,
    updatedOn: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var User = require('./user')(sequelize, DataTypes);
  Quiz.hasOne(User, {foreignKey: 'userId', targetKey: 'id'});

  return Quiz;
};