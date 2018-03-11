const QuizResults = require('../lib/quiz-results');

const TestUser = require('./lib/user');
const TestQuiz = require('./lib/quiz');

describe('quiz results', () => {
    it('gets latest quiz result', done => {
        const EXPECTED_RESULT = 78;

        let test = async function() {
            let user = await TestUser.createTestUser();
            await TestQuiz.createFinishedTestQuiz(user.id, 50, EXPECTED_RESULT);

            return await QuizResults.getLatestQuizResult(user);
        };

        test().then(result => {
            if (result == EXPECTED_RESULT)
                done();
        });
    });
   
    it('gets finished quizzes', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            await TestQuiz.createTestQuiz(user.id);
            await TestQuiz.createFinishedTestQuiz(user.id, 50, 0);
            await TestQuiz.createFinishedTestQuiz(user.id, 50, 1);
            await TestQuiz.createFinishedTestQuiz(user.id, 50, 2);

            return await QuizResults.getFinishedQuizzes(user);
        };

        test().then(quizzes => {
            if (quizzes.length == 3)
                done();
        });
    });
    
    it('gets users with their result information', done => {
        let test = async function() {
            let user1 = await TestUser.createTestUser();
            await TestQuiz.createFinishedTestQuiz(user1.id, 50, 5);
            await TestQuiz.createFinishedTestQuiz(user1.id, 50, 6);
            await TestQuiz.createFinishedTestQuiz(user1.id, 50, 7);

            let user2 = await TestUser.createTestUser();
            await TestQuiz.createFinishedTestQuiz(user2.id, 50, 1);
            await TestQuiz.createFinishedTestQuiz(user2.id, 50, 2);
            await TestQuiz.createFinishedTestQuiz(user2.id, 50, 3);

            return await QuizResults.getUsersWithResultInfo();
        };

        test().then(users => {
            if (users.length >= 2 && users[users.length - 1].mostRecentQuizResult == 3)
                done();
        });
    });
});