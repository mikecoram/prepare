'use strict';
module.exports = function(sequelize, DataTypes) {
  var Section = sequelize.define('Section', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sectionTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    extraLength: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  });

  Section.associate = function(models) {
    Section.belongsTo(models.Quiz, {
      foreignKey: 'quizId',
      targetKey: 'id',
      as: 'quiz'
    });
  }

  return Section;
};