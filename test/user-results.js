describe('user-results', () => {
    it('getsResults', done => {

        const QuizResults = require('../lib/quiz-results');
        QuizResults.getUsersWithResultInfo().then((users) => {
            done();
        }, err => {
            done(err);
        });
    });
});