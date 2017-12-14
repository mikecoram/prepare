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
        // associations can be defined here
      }
    }
  });

  var ExampleTemplate = require('./exampletemplate')(sequelize, DataTypes);
  Example.hasOne(ExampleTemplate, {foreignKey: 'exampleTemplateId', targetKey: 'id'});

  var Section = require('./section')(sequelize, DataTypes);
  Example.hasOne(Section, {foreignKey: 'sectionId', targetKey: 'id'});

  return Example;
};