const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');

exports.quiz = function(req, res) {
    getUserQuiz(req.user).then((quiz) => {
        if (quiz) {
            res.redirect('/quiz/section/' + getMostRecentSection(quiz));
        }
        else {
            res.render('quiz/new-quiz', {
                authorised: req.user != undefined
            });
        }
    });
}

exports.uploadAnswers = function(req, res) {
    let answers = req.body.answers;
    let user = req.user;   
    
    // if user has unfinished quiz
    Quiz.find({
        where: {
            userId: user.id,
            finishedOn: null
        },
        include: [{model: Section, as: 'sections'}] 
    }).then((quiz) => {
        console.log(quiz)
    });
}

exports.quizSection = function(req, res) {
    getSectionData(req.user, req.params.sectionNum).then((sectionData) => {
        getSections(req.user, req.params.sectionNum).then((sections) => {
            res.render('quiz/quiz-section', {
                authorised: req.user != undefined,
                sections: sections,
                sectionData: sectionData,
                hidePreviousBtn: req.params.sectionNum == sections[0].number,
                hideNextBtn: req.params.sectionNum == sections[sections.length - 1].number,
                showPreviousBtn: req.params.sectionNum != sections[0].number,
                showNextBtn: req.params.sectionNum != sections[sections.length - 1].number,
                previousSectionNum: req.params.sectionNum - 1,
                nextSectionNum: req.params.sectionNum + 1,
            });
        });
    });
}

const QuizGenerator = require(__base + '/lib/quiz-generator');

exports.generateNewQuiz = function(req, res) {
    userHasQuiz(req.user).then((hasQuiz) => {
        if (!hasQuiz) {
            QuizGenerator.generate({
                userId: req.user.id,
                graded: false,
                difficulty: 0
            }).then(() => {
                res.redirect('/quiz');
            });        
        }
    });
}

function getMostRecentSection(quiz) {
    return 0;
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

function getSections(user, currentSectionNum) {
    return new Promise((resolve, reject) => {
        Quiz.find({
            where: {
                userId: user.id,
                finishedOn: null
            },
            include: [{
                model: Section,
                as: 'sections'
            }]
        }).then((quiz) => {
            let rawSections = quiz.sections;
            let sections = [];

            rawSections.forEach((s) => {
                sections.push({
                    number: s.number,
                    current: s.number == currentSectionNum
                });
            });

            resolve(sections.sort((a, b) => {return a.number - b.number;}));
        });
    });
}

function getSectionData(user, sectionNum) {
    return new Promise((resolve, reject) => {
        // check user has quiz available

        // get user's current quiz
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
                }
            }]
        }).then((quiz) => {
            let section = quiz.sections[0];

            let seq = [
                Example.findAll({
                    where: {sectionId: section.id}, 
                    include: [{model: ExampleTemplate, as: 'exampleTemplate'}]
                }),
                Question.findAll({where: {sectionId: section.id}})
            ];

            Promise.all(seq).then((results) => {
                let examples = results[0];
                let questions = results[1];

                resolve(createSectionData(examples, questions));
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