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
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  var Quiz = require('./quiz')(sequelize, DataTypes);
  Section.hasOne(Quiz, {foreignKey: 'quizId', targetKey: 'id'});

  var SectionTemplate = require('./sectiontemplate')(sequelize, DataTypes);
  Section.hasOne(SectionTemplate, {foreignKey: 'sectionTemplateId', targetKey: 'id'});

  return Section;
};