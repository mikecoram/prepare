const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');

exports.getSections = getSections;
exports.getSectionData = getSectionData;
exports.getEarliestUnfinishedSectionNum = getEarliestUnfinishedSectionNum;

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