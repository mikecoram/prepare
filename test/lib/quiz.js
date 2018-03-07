exports.createTestQuiz = createTestQuiz;
exports.createFinishedTestQuiz = createFinishedTestQuiz;
exports.deleteTestQuiz = deleteTestQuiz;

const { Quiz } = require('../../models');

function createTestQuiz(userId) {
    return Quiz.create({
        userId: userId,
        difficulty: 50,
        graded: true
    });
}

function createFinishedTestQuiz(userId, difficulty, result) {
    return Quiz.create({
        userId: userId,
        difficulty: difficulty || 0,
        finishedOn: new Date(),
        graded: true,
        result: result
    });
}

function deleteTestQuiz(quiz) {
    return Quiz.destroy({
        where: {
            id: quiz.id
        }
    });
}