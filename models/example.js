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
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  let ExampleTemplate = require('./exampletemplate')(sequelize, DataTypes);

  Example.belongsTo(ExampleTemplate, {
    foreignKey: 'exampleTemplateId', 
    targetKey: 'id', 
    as: 'exampleTemplate',
  });

  return Example;
};