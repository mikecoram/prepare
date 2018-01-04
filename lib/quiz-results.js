const { Quiz, User } = require('../models/');
const USER_ROLE = require('../constants').USER_ROLE.USER;

const QuizUser = require('./quiz-user');
const Op = require('sequelize').Op;

const DateHelper = require('./date-helper');

exports.getLatestQuizResult = getLatestQuizResult;
exports.getFinishedQuizzes = getFinishedQuizzes;
exports.getUsersWithResultInfo = getUsersWithResultInfo;

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

function getUsersWithResultInfo() {
    return new Promise((resolve, reject) => {
        User.findAll({
            where: {
                role: USER_ROLE
            },
            include: [{
                model: Quiz,
                as: 'quizzes',
                where: {
                    [Op.not]: {
                        finishedOn: null
                    }
                }
            }]
        }).then((rawUsers) => {
            let users = [];

            if (rawUsers) {
                rawUsers.forEach((u) => {
                    let mrFinished, mrResult, mrDifficulty;
                    let numQuizzes = 0;

                    if (u.quizzes) {
                        let mostRecentQuiz = u.quizzes.sort((a, b) => { 
                            return a.finishedOn > b.finsihedOn; 
                        })[u.quizzes.length - 1];

                        mrFinished = mostRecentQuiz.finishedOn;
                        mrResult = mostRecentQuiz.result;
                        mrDifficulty = mostRecentQuiz.difficulty;
                        numQuizzes = u.quizzes.length;
                    }

                    users.push({
                        id: u.id,
                        emailAddress: u.emailAddress,
                        numQuizzes: numQuizzes,
                        mostRecentQuizFinishedDate: DateHelper.format(mrFinished),
                        mostRecentQuizDifficulty: mrDifficulty,
                        mostRecentQuizResult: mrResult
                    });
                });
            }

            resolve(users);
        }, (err) => {
            reject(err);
        });
    });
}