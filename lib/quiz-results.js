const { Quiz } = require('../models/');

const QuizUser = require('./quiz-user');
const Op = require('sequelize').Op;

exports.getLatestQuizResult = getLatestQuizResult;
exports.getFinishedQuizzes = getFinishedQuizzes;

function getLatestQuizResult(user) {
    return new Promise((resolve, reject) => {
        QuizUser.getMostRecentlyFinishedQuiz(user).then((quiz) => {
            resolve(quiz.result);
        }, (err) => {
            reject(err);
        });   
    });
}

function getFinishedQuizzes(user) {
    return new Promise((resolve, reject) => {
        Quiz.findAll({
            where: {
                userId: user.id,
                [Op.not]: [
                    {finishedOn: null}
                ]
            },
            order: [['finishedOn', 'DESC']]
        }).then((quizzes) => {
            resolve(quizzes);
        }, (err) => {
            reject(err);
        });
    });
}