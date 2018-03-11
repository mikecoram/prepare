const QuizUser = require('../lib/quiz-user');
const TestUser = require('./lib/user');
const TestQuiz = require('./lib/quiz');

describe('quiz user', () => {
    it('asserts quiz belongs to user', done => {
        let test = async function () {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.createTestQuiz(user.id);

            return await QuizUser.quizBelongsToUser(user.id, quiz.id);
        }

        test().then(result => {
            if (result == true)
                done();
        });
    });

    it('asserts quiz does not belong to user', done => {
        let test = async function () {
            let user1 = await TestUser.createTestUser();
            let user2 = await TestUser.createTestUser();
            let quiz = await TestQuiz.createTestQuiz(user1.id);

            return await QuizUser.quizBelongsToUser(user2.id, quiz.id);
        }

        test().then(result => {
            if (result == false)
                done();
        });
    });

    it('asserts user has quiz', done => {
        let test = async function () {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.createTestQuiz(user.id);

            return await QuizUser.hasQuiz(user);
        }

        test().then(result => {
            if (result == true)
                done();
        });
    });

    it('asserts user does not have a quiz', done => {
        let test = async function () {
            let user = await TestUser.createTestUser();

            return await QuizUser.hasQuiz(user);
        }

        test().then(result => {
            if (result == false)
                done();
        });
    });

    it('gets active user quiz', done => {
        var expectedId;

        let test = async function() {
            let user = await TestUser.createTestUser();
            let finishedQuiz = await TestQuiz.createFinishedTestQuiz(user.id);
            let unfinishedQuiz = await TestQuiz.createTestQuiz(user.id);

            expectedId = unfinishedQuiz.id;

            return await QuizUser.getQuiz(user);
        }

        test().then(quiz => {
            if (expectedId == quiz.id)
                done();
        });
    });

    it('gets most recently finished quiz', done => {
        var expectedId;

        let test = async function() {
            let user = await TestUser.createTestUser();
            let finishedQuiz1 = await TestQuiz.createFinishedTestQuiz(user.id);
            let finishedQuiz2 = await TestQuiz.createFinishedTestQuiz(user.id);
            let unfinishedQuiz = await TestQuiz.createTestQuiz(user.id);

            expectedId = finishedQuiz2.id;

            return await QuizUser.getMostRecentlyFinishedQuiz(user);
        }

        test().then(quiz => {
            if (quiz.id == expectedId)
                done();
        });
    });

    it('gets default new difficulty', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            return await QuizUser.getNewDifficulty(user);
        }

        test().then(result => {
            if (result == 50)
                done();
        });
    });

    it('increases difficulty when result is over 59', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.createFinishedTestQuiz(user.id, 60, 60);

            return await QuizUser.getNewDifficulty(user);
        }

        test().then(result => {
            if (result >= 60)
                done();
        })
    });

    it('reduces difficulty when result is under 40', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.createFinishedTestQuiz(user.id, 60, 30);

            return await QuizUser.getNewDifficulty(user);
        }

        test().then(result => {
            if (result < 60)
                done();
        })
    });
});