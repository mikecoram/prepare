'use strict';

const { SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator } = require('../models');
const { seedTemplates } = require('../quiz-templating/template-seeder');

let readQuizTemplateData = require('../quiz-templating/template-reader').read;

module.exports = {
  up: function (queryInterface, Sequelize) {
    let templateData = readQuizTemplateData()[0];

    return seedTemplates(
      templateData.sectionTemplate,
      templateData.exampleTemplates,
      templateData.questionTemplates,
      templateData.valueGenerators
    );
  },

  down: function (qi, Sequelize) {
    return new Promise((resolve, reject) => {
      qi.bulkDelete('SectionTemplates', null, {}).then(() => {
        qi.bulkDelete('ExampleTemplates', null, {}).then(() => {
          qi.bulkDelete('QuestionTemplates', null, {}).then(() => {
            qi.bulkDelete('ValueGenerators', null, {}).then(() => {
              resolve();
            });
          });
        });
      });
    });
  }
};
