const { Quiz } = require('../models/');

exports.hasQuiz = userHasQuiz;
exports.getQuiz = getUserQuiz;
exports.getMostRecentlyFinishedQuiz = getMostRecentlyFinishedQuiz;
exports.getNewDifficulty = getNewDifficulty;
exports.quizBelongsToUser = quizBelongsToUser;

async function quizBelongsToUser(userId, quizId) {
    let quiz = await Quiz.findOne({
        where: {
            id: quizId,
            userId: userId
        }
    });

    return quiz != undefined;
}

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

function getNewDifficulty(user) {
    return new Promise((resolve, reject) => {
        getMostRecentlyFinishedQuiz(user).then((quiz) => {
            let newDifficulty = 50;

            if (quiz) {
                // Calculate difficulty of next quiz based on last result and difficulty
                if (quiz.result >= 80) {
                    newDifficulty = quiz.difficulty + 25;                
                }
                else if (quiz.result >= 70) {
                    newDifficulty = quiz.difficulty + 20;
                }
                else if (quiz.result >= 60) {
                    newDifficulty = quiz.difficulty + 10;
                }
                else if (quiz.result <= 20) {
                    newDifficulty = quiz.difficulty - 20;
                }
                else if (quiz.result <= 40) {
                    newDifficulty = quiz.difficulty - 10;
                }

                if (newDifficulty < 0) {
                    newDifficulty = 0;
                }
                if (newDifficulty > 100) {
                    newDifficulty = 100;
                }
            }

            resolve(newDifficulty);
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