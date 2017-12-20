'use strict';
module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    input: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expectedOutput: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userOutput: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correct: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Question.associate = function(models) {
    Question.belongsTo(models.Section, {
      foreignKey: 'sectionId',
      targetKey: 'id',
      as: 'section'
    });
  }

  return Question;
};