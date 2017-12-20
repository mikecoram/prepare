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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Quiz.hasMany(models.Section, {
          foreignKey: 'quizId',
          as: 'sections'
        });
      }
    }
  });

  return Quiz;
};