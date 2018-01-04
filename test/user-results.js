describe('user-results', () => {
    it('getsResults', done => {

        const QuizResults = require('../lib/quiz-results');
        QuizResults.getUsersWithResultInfo().then((users) => {
            console.log(users);
            done();
        }, err => {
            done(err);
        });
    });
});