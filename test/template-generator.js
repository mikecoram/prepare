const Reader = require('../quiz-templating/reader');
const Seeder = require('../quiz-templating/seeder');

const { SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator} = require('../models');

const TEST_TEMPLATE_DIR = __dirname + '/test-quiz-templates';

describe('quiz template generator', () => {
    it('reads template files and converts them to JSON objects', done => {
        let templates = Reader.read(TEST_TEMPLATE_DIR);

        if (templates.length == 2 &&
            templates[0].valueGenerators[0].type == 'string' &&
            templates[1].valueGenerators[0].type == 'integer')
            done();
    });

    it('adds templates to the database', done => {
        var test = async function() {
            await clearTemplates();

            let sections = Reader.read(TEST_TEMPLATE_DIR);
            for (let section of sections) {
                await Seeder.seed(
                    section.sectionTemplate,
                    section.exampleTemplates,
                    section.questionTemplates,
                    section.valueGenerators
                );
            }

            let sts = await SectionTemplate.findAll({where:{}});
            let qts = await QuestionTemplate.findAll({where:{}});
            let ets = await ExampleTemplate.findAll({where:{}});
            let vgs = await ValueGenerator.findAll({where:{}});

            return sts.length == 2 &&
                qts.length == 3 &&
                ets.length == 2 &&
                vgs.length == 3;
        }

        test().then((result) => {
            if (result)
                done();
        });
    });
});

async function clearTemplates() {
    await SectionTemplate.destroy({where:{}});
    await ExampleTemplate.destroy({where:{}});
    await QuestionTemplate.destroy({where:{}});
    await ValueGenerator.destroy({where:{}});
}