const QuizMarker = require('../lib/quiz-marker');
const TestUser = require('./lib/user');
const TestQuiz = require('./lib/quiz');

describe('quiz marker', () => {
    it('marks a quiz', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.generateQuiz(user);

            await QuizMarker.markQuiz(user);

            return await TestQuiz.getQuiz(quiz.id);
        };

        test().then(markedQuiz => {
            if (markedQuiz.finishedOn)
                done();
        });
    });
});