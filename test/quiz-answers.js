const QuizAnswers = require('../lib/quiz-answers');

const TestUser = require('./lib/user');
const TestQuiz = require('./lib/quiz');

describe('quiz answers', () => {
    it('uploads answers', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.generateQuiz(user);


            var answers = [];

            for (let q of quiz.sections[0].questions) {
                answers.push({
                    questionId: q.id,
                    userOutput: q.userOutput
                });
            }

            return await QuizAnswers.uploadAnswers(user, answers, 1);
        };
        
        test().then(response => {
            if (response.status == 200)
                done();
        });
    });
});