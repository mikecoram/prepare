'use strict';
module.exports = function(sequelize, DataTypes) {
  var QuestionTemplate = sequelize.define('QuestionTemplate', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sectionTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inputTemplate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outputTemplate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var SectionTemplate = require('./sectiontemplate')(sequelize, DataTypes);
  QuestionTemplate.hasOne(SectionTemplate, {foreignKey: 'sectionTemplateId', targetKey: 'id'})

  return QuestionTemplate;
};