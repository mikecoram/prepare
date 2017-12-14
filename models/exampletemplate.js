'use strict';
module.exports = function(sequelize, DataTypes) {
  var ExampleTemplate = sequelize.define('ExampleTemplate', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    input: {
      type: DataTypes.STRING,
      allowNull: false
    },
    output: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sectionTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var SectionTemplate = require('./sectiontemplate')(sequelize, DataTypes);
  ExampleTemplate.hasOne(SectionTemplate, {foreignKey: 'sectionTemplateId', targetKey: "id"});

  return ExampleTemplate;
};