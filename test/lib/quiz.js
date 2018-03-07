exports.createTestQuiz = createTestQuiz;
exports.createFinishedTestQuiz = createFinishedTestQuiz;
exports.deleteTestQuiz = deleteTestQuiz;
exports.getQuiz = getQuiz;

const { Quiz, Section, Question, Example } = require('../../models');

function createTestQuiz(userId) {
    return Quiz.create({
        userId: userId,
        difficulty: 50,
        graded: true
    });
}

function getQuiz(quizId) {
    return Quiz.findOne({
        where:{
            id: quizId
        },
        include: [{
            model: Section,
            as: 'sections',
            include: [{
                model: Question,
                as: 'questions'
            }, {
                model: Example,
                as: 'examples'
            }]
        }]
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