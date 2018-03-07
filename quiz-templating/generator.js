// Read templates from ./templates folder and upload to the database

const { SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator } = require('../models');

const reader = require('./reader');
const seeder = require('./seeder');

(function () {
    console.log('Clearing existing templates...')
    
    clearTemplates().then(() => {
        console.log('Generating new template data for the database...')

        generate().then(() => {
            console.log('Quiz template generation complete.')
            process.exit();
        }, (err) => {
            console.log(err);
        });
    })
})();

function generate() {
    return new Promise((resolve, reject) => {
        let templateData = reader.read(reader.TEMPLATE_DIR);

        let seq = [];

        templateData.forEach((section) => {
            seq.push(seeder.seed(
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
        Promise.all([
            SectionTemplate.destroy(DROP_SETTINGS),
            ExampleTemplate.destroy(DROP_SETTINGS),
            QuestionTemplate.destroy(DROP_SETTINGS),
            ValueGenerator.destroy(DROP_SETTINGS)
        ]).then(() => {
            resolve();
        }, err => {
            reject(err);
        });
    });
}