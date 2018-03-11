const { SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator} = require('../../models');

exports.clearTemplates = clearTemplates;
exports.createTemplates = createTemplates;

async function clearTemplates() {
    await SectionTemplate.destroy({where:{}});
    await ExampleTemplate.destroy({where:{}});
    await QuestionTemplate.destroy({where:{}});
    await ValueGenerator.destroy({where:{}});
}

async function createTemplates() {
    const Reader = require('../../quiz-templating/reader');
    const Seeder = require('../../quiz-templating/seeder');
    const TEST_TEMPLATE_DIR = __dirname + '/../test-quiz-templates';


    let seederData = [];
    for (let t of Reader.read(TEST_TEMPLATE_DIR)) {
        await Seeder.seed(
            t.sectionTemplate,
            t.exampleTemplates,
            t.questionTemplates,
            t.valueGenerators    
        );
    }
}