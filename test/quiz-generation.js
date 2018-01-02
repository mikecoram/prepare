const quizGenerator = require('../lib/quiz-generator');

describe('quiz-generation', () => {
    it('generates', (done) => {
        quizGenerator.generate({id: 0}, {
            graded: false,
            difficulty: 0
        }).then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });
});