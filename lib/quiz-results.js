const { Quiz } = require('../models/');

const QuizUser = require('./quiz-user');

exports.getLatestQuizResult = getLatestQuizResult;

function getLatestQuizResult(user) {
    return new Promise((resolve, reject) => {
        QuizUser.getMostRecentlyFinishedQuiz(user).then((quiz) => {
            resolve(quiz.result);
        }, (err) => {
            reject(err);
        });   
    });
}