// Read templates from ./templates folder and upload to the database

const { SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator } = require('../models');

const templateReader = require('./template-reader');
const templateSeeder = require('./template-seeder');

(function () {
    clearTemplates().then(() => {
        generate().then(() => {
            console.log('Quiz template generation complete.')
            process.exit();
        });
    })
})();

function generate() {
    return new Promise((resolve, reject) => {
        let templateData = templateReader.read();

        let seq = [];

        templateData.forEach((section) => {
            seq.push(templateSeeder.seed(
                section.sectionTemplate,
                section.exampleTemplates,
                section.questionTemplates,
                section.valueGenerators    
            ));
        });   

        Promise.all(seq).then(() => {
            resolve();
        }, (err) => {
            reject(err);
        });
    });
}

function clearTemplates() {
    const DROP_SETTINGS = {where: {}};

    return new Promise((resolve, reject) => {
      SectionTemplate.destroy(DROP_SETTINGS).then(() => {
        ExampleTemplate.destroy(DROP_SETTINGS).then(() => {
            QuestionTemplate.destroy(DROP_SETTINGS).then(() => {
                ValueGenerator.destroy(DROP_SETTINGS).then(() => {
                    resolve();
                });
            });
        });
      });
    });
}