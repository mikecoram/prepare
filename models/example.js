'use strict';
module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define('Example', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    exampleTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Example.associate = function (models) {
    Example.belongsTo(models.ExampleTemplate, {
      foreignKey: 'exampleTemplateId', 
      onDelete: 'CASCADE',
      as: 'exampleTemplate'
    });

    Example.belongsTo(models.Section, {
      foreignKey: 'sectionId', 
      onDelete: 'CASCADE',
      as: 'section'
    });
  }

  return Example;
};