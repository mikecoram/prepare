const { Quiz } = require('../models/');

exports.hasQuiz = userHasQuiz;
exports.getQuiz = getUserQuiz;
exports.getMostRecentlyFinishedQuiz = getMostRecentlyFinishedQuiz;

function userHasQuiz(user) {
    return new Promise((resolve, reject) => {
        getUserQuiz(user).then((quiz) => {
            resolve(quiz != undefined);
        }, (err) => {
            reject(err);
        });
    });
}

function getUserQuiz(user) {
    return new Promise((resolve, reject) => {
        Quiz.find({
            where: {
                userId: user.id,
                finishedOn: null
            }
        }).then((quiz) => {
            resolve(quiz);
        }, (err) => {
            reject(err);
        });
    });
}

function getMostRecentlyFinishedQuiz(user) {
    return new Promise((resolve, reject) => {
        const Op = require('sequelize').Op;
        
        Quiz.find({
            where: {
                userId: user.id,
                [Op.not]: [
                    {finishedOn: null}
                ]
            },
            order: [['finishedOn', 'DESC']]
        }).then((quiz) => {
            resolve(quiz);
        }, (err) => {
            reject(err);
        });   
    });
}