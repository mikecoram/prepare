'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('QuestionTemplates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sectionTemplateId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      inputTemplate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      outputTemplate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      difficulty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('QuestionTemplates');
  }
};