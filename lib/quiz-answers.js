const { Quiz, Section, Question } = require('../models/');

exports.uploadAnswers = uploadAnswers;

function uploadAnswers(user, answers, sectionNum) {
    return new Promise((resolve, reject) => {
        // if user has unfinished quiz
        Quiz.find({
            where: {
                userId: user.id,
                finishedOn: null
            },
            include: [{
                model: Section, 
                as: 'sections',
                where: {
                    number: sectionNum
                },
                include: [{
                    model: Question,
                    as: 'questions'
                }]
            }]
        }).then((quiz) => {
            let questions = quiz.sections[0].questions;

            questions.forEach((q) => {
                let a = answers.find((a) => {return a.questionId == q.id});

                if (a) {
                    Question.update({
                        userOutput: a.userOutput
                    }, {
                        where: {
                            id: q.id
                        },
                    }).then((result) => {
                        resolve({status:200, response:'Uploaded!'});
                    }, (err) => {
                        reject(err);
                    });
                }
            });
        }, (err) => {
            resolve({status: 400, response: 'No quiz found!'});
        });
    });
}