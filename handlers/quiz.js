exports.quiz = function (req, res) {
    res.render('quiz/quiz', {
        authorised: req.user != undefined
    });
}

exports.quizSection = function(req, res) {
    getSectionData(req.user, req.params.sectionNum).then((sectionData) => {
        res.render('quiz/quiz-section', {
            authorised: req.user != undefined,
            sectionData: sectionData
        });
    });
}

const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');

function getSectionData(user, sectionNum) {
    return new Promise((resolve, reject) => {
        // check user has quiz available

        // get user's current quiz
        Quiz.find({
            where: {
                //userId: user.id,
                finishedOn: null
            }
        }).then((quiz) => {
            Section.find({
                where: {
                    quizId: quiz.id,
                    number: sectionNum
                }
            }).then((section) => {
                let seq = [
                    Example.findAll({
                        where: {sectionId: section.id}, 
                        include: [{model: ExampleTemplate, as: 'exampleTemplate'}]}),
                    Question.findAll({where: {sectionId: section.id}})
                ];

                Promise.all(seq).then((results) => {
                    let examples = results[0];
                    let questions = results[1];

                    resolve(createSectionData(examples, questions));
                });
            });
        });
    });
}

function createSectionData(examples, questions) {
    let sectionData = [];

    examples.forEach((e) => {
        sectionData.push({
            id: e.id,
            input: e.exampleTemplate.input,
            output: e.exampleTemplate.output,
            position: e.exampleTemplate.position,
            example: true
        });
    });

    questions.forEach((q) => {
        sectionData.push({
            id: q.id,
            input: q.input,
            position: q.position,
            example: false
        })
    });

    // sort by position
    return sectionData.sort((a, b) => {return a.position - b.position;});
}