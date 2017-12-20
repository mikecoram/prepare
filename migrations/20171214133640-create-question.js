'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      input: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expectedOutput: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userOutput: {
        type: Sequelize.STRING,
        allowNull: true
      },
      correct: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      sectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Sections',
          key: 'id',
          as: 'section'
        }
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    return queryInterface.dropTable('Questions');
  }
};