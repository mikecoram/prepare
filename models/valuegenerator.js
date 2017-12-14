'use strict';
module.exports = function(sequelize, DataTypes) {
  var ValueGenerator = sequelize.define('ValueGenerator', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    questionTemplateId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var QuestionTemplate = require('./questiontemplate')(sequelize, DataTypes);
  ValueGenerator.hasOne(QuestionTemplate, {foreignKey: 'questionTemplateId', targetKey: 'id'});

  return ValueGenerator;
};