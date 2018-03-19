exports.uploadAnswers = uploadAnswers;

const { Quiz, Section, Question } = require('../models/');

async function uploadAnswers(user, answers, sectionNum) {
    // if user has unfinished quiz
    let quiz;

    try {
        quiz = await Quiz.find({
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
        });
    } catch (ex) {
        resolve({status: 400, response: 'No quiz found!'});
    }
    

    let questions = quiz.sections[0].questions;

    for (let question of questions) {
        let answer = answers.find(a => {return a.questionId == question.id});

        if (answer) {
            await Question.update({
                userOutput: answer.userOutput
            }, {
                where: {
                    id: question.id
                },
            });

            return {status:200, response:'Uploaded!'};
        }
    }
}