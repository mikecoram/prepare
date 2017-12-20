describe('sequelize-queries', () => {
    it('getsExamplesWithExampleTemlate', (done) => {
        let models = require('../models');
        let {Example, ExampleTemplate} = require('../models');

        Example.find({include: {
            model: ExampleTemplate,
            as: 'exampleTemplate'
        }}).then((examples) => {
            done();
        });

    });

    it('getsExampleTemplatesWithExamples', (done) => {
        let {Example, ExampleTemplate} = require('../models');
        
        ExampleTemplate.find({include: {
            model: Example,
            as: 'examples'
        }}).then((exampleTemplate) => {
            done();
        });
    });
});