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
  });

  Quiz.associate = function(models) {
    Quiz.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user'
    });

    Quiz.hasMany(models.Section, {
      foreignKey: 'quizId',
      as: 'sections'
    });
  }

  return Quiz;
};