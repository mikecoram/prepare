const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');
const QuizMarker = require('../lib/quiz-marker');

exports.quiz = function(req, res) {
    getUserQuiz(req.user).then((quiz) => {
        if (quiz) {
            getEarliestUnfinishedSectionNum(quiz).then((currentSectionNum) => {
                res.redirect('/quiz/section/' + currentSectionNum + '?tutorial=' + (req.query.tutorial || false));
            });
        }
        else {
            res.redirect('/quiz/intro');
        }
    });
}

exports.intro = function(req, res) {
    res.render('quiz/intro', {
        authorised: req.user != undefined
    });
}

exports.finish = function(req, res) {
    // mark quiz
    QuizMarker.markQuiz(req.user).then((result) => {
        res.redirect('/quiz/results');
    });
}

exports.results = function(req, res) {
    const Op = require('sequelize').Op;

    Quiz.find({
        where: {
            userId: req.user.id,
            [Op.not]: [
                {finishedOn: null}
            ]
        },
        order: [['finishedOn', 'DESC']]
    }).then((quiz) => {
        res.render('quiz/results', {
            authorised: req.user != undefined,
            result: quiz.result,
            completed: false
        });
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
        include: [{
            model: Section, 
            as: 'sections',
            where: {
                number: req.body.sectionNum
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
                    res.status(200).send('Uploaded!');
                }, (err) => {
                    res.status(500).send('Failed to upload!');
                });
            }
        });
    }, (err) => {
        res.status(400).send('Failed to upload!');
    });
}

exports.quizSection = function(req, res) {
    getSectionData(req.user, req.params.sectionNum).then((sectionData) => {
        getSections(req.user, req.params.sectionNum).then((sections) => {
            res.render('quiz/section', {
                authorised: req.user != undefined,
                sections: sections,
                sectionData: sectionData,
                hidePreviousBtn: req.params.sectionNum == sections[0].number,
                hideNextBtn: req.params.sectionNum == sections[sections.length - 1].number,
                showPreviousBtn: req.params.sectionNum != sections[0].number,
                showNextBtn: req.params.sectionNum != sections[sections.length - 1].number,
                previousSectionNum: Number.parseInt(req.params.sectionNum) - 1,
                sectionNum: Number.parseInt(req.params.sectionNum),
                nextSectionNum: Number.parseInt(req.params.sectionNum) + 1,
                showTutorial: req.query.tutorial || false
            });
        });
    });
}

function userFirstQuiz(user) {
    Quiz.find({
        where: {
            userId: user.id
        }
    })
}

const QuizGenerator = require(__base + '/lib/quiz-generator');

exports.generateNewQuiz = function(req, res) {
    userHasQuiz(req.user).then((hasQuiz) => {
        if (hasQuiz) {
            res.redirect('/quiz');
        }
        else {
            console.log('Generating new quiz...')
            QuizGenerator.generate({
                userId: req.user.id,
                graded: false,
                difficulty: 0
            }).then(() => {
                res.redirect('/quiz?tutorial=true');
            }, (err) => {
                console.log(err);
            });        
        }
    });
}

function getEarliestUnfinishedSectionNum(quiz) {
    return new Promise((resolve, reject) => {
        Section.find({
            where: {
                quizId: quiz.id
            },
            include: [{
                model: Question,
                as: 'questions',
                where: {
                    userOutput: null
                },
            }],
            order: [['number', 'ASC']]
        }).then((s) => {
            resolve(s ? s.number : 1);
        });
    });
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

const posSort = (a, b) => {return a.position - b.position;};

function getSectionData(user, sectionNum) {
    return new Promise((resolve, reject) => {
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
                }, {
                    model: Example,
                    as: 'examples',
                    include: [{
                        model: ExampleTemplate,
                        as: 'exampleTemplate'
                    }]
                }]
            }]
        }).then((quiz) => {
            resolve(createSectionData(
                quiz.sections[0].examples.sort(posSort), 
                quiz.sections[0].questions.sort(posSort)
            ));
        }, (err) => {
            reject(err);
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
            example: true,
            first: e == examples[0]
        });
    });

    questions.forEach((q) => {
        sectionData.push({
            id: q.id,
            input: q.input,
            output: q.userOutput,
            position: q.position,
            example: false,
            first: q == questions[0]
        })
    });

    return sectionData.sort(posSort);
}