const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');

exports.markQuiz = markQuiz;

function markQuiz(user) {
    return new Promise((resolve, reject) => {
        Quiz.find({
            where: {
                userId: user.id,
                finishedOn: null
            },
            include: [{
                model: Section,
                as: 'sections',
                include: [{
                    model: Question,
                    as: 'questions'
                }]
            }]
        }).then((quiz) => {

            let seq = [];
            let results = [];

            // mark questions
            quiz.sections.forEach((s) => {
                s.questions.forEach((q) => {
                    let r = markQuestion(q);
                    results.push(r);

                    seq.push(Question.update({
                        correct: r
                    }, {
                        where: {
                            id: q.id
                        }
                    }));
                });
            });

            // grade quiz and set finished
            seq.push(Quiz.update({
                finishedOn: new Date(),
                result: gradeQuiz(results, quiz.difficulty)
            }, {
                where: {
                    userId: user.id,
                    finishedOn: null
                }
            }));

            Promise.all(seq).then((results) => {
                resolve();
            }, (err) => {
                reject(err);
            });
        });
    });
}

function markQuestion(question, difficulty) {
    // Some questions are meant to be left blank
    if (question.expectedOutput == '' && question.userOutput == null) {
        return true;
    } 

    if (question.userOutput) {
        return question.userOutput == question.expectedOutput;
    }
    else {
        return false;
    }
}

function gradeQuiz(results) {
    return (results.filter((r) => {return r == true;}).length / results.length) * 100;
}