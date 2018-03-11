exports.createTestQuiz = createTestQuiz;
exports.createFinishedTestQuiz = createFinishedTestQuiz;
exports.deleteTestQuiz = deleteTestQuiz;
exports.getQuiz = getQuiz;
exports.generateQuiz = generateQuiz;

const { Quiz, Section, Question, Example } = require('../../models');
const QuizGenerator = require('../../lib/quiz-generator');
const TestTemplates = require('./templates');

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

async function generateQuiz(user) {
    await TestTemplates.clearTemplates();
    await TestTemplates.createTemplates();

    let generatedQuiz = await QuizGenerator.generate(user, {
        graded: true,
        difficulty: 50
    });

    return await getQuiz(generatedQuiz.id);
}