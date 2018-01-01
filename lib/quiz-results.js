const { Quiz } = require('../models/');

exports.getLatestQuizResult = getLatestQuizResult;

function getLatestQuizResult(user) {
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
            resolve(quiz.result);
        }, (err) => {
            reject(err);
        });   
    });
}