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
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sectionTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  ExampleTemplate.associate = function(models) {
    ExampleTemplate.hasMany(models.Example, {
      foreignKey: 'exampleTemplateId',
      as: 'examples'
    });
  }

  return ExampleTemplate;
};