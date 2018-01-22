const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');

exports.getSections = getSections;
exports.getSectionData = getSectionData;
exports.getEarliestUnfinishedSectionNum = getEarliestUnfinishedSectionNum;

function getSections(user, currentSectionNum, quizId) {
    return new Promise((resolve, reject) => {
        Quiz.find({
            where: createWhereQuery(user, quizId),
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
                    current: s.number == currentSectionNum,
                    url: !quizId ? 
                        `/quiz/section/${s.number}` : 
                        `/quiz/${quizId}/section/${s.number}`
                });
            });

            resolve(sections.sort((a, b) => {return a.number - b.number;}));
        });
    });
}

function createWhereQuery(user, quizId) {
    if (!quizId) {
        return {
            userId: user.id,
            finishedOn: null
        };
    }
    else {
        return {
            id: quizId
        };
    }
}

const posSort = (a, b) => {return a.position - b.position;};
const examplePosSort = (a, b) => {return a.exampleTemplate.position - b.exampleTemplate.position;};

function getSectionData(user, sectionNum, quizId) {
    return new Promise((resolve, reject) => {
        Quiz.find({
            where: createWhereQuery(user, quizId),
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
                quiz.sections[0].questions.sort(posSort),
                quizId != undefined
            ));
        }, (err) => {
            reject(err);
        });
    });
}

function createSectionData(examples, questions, quizFinished) {
    let sectionData = [];
    let sortedExamples = examples.sort(examplePosSort);

    if (!quizFinished) {
        sortedExamples.forEach((e) => {
            sectionData.push({
                id: e.id,
                input: e.exampleTemplate.input,
                output: e.exampleTemplate.output,
                position: e.exampleTemplate.position,
                disabled: true,
                example: true,
                first: e == sortedExamples[0]
            });
        });
    }

    questions.forEach((q) => {
        sectionData.push({
            id: q.id,
            input: q.input,
            output: q.userOutput,
            position: q.position,
            example: false,
            first: q == questions[0],
            correct: quizFinished ? q.correct : null,
            incorrect: quizFinished ? !q.correct : null,
            expectedOutput: quizFinished ? q.expectedOutput : null,
            disabled: quizFinished
        });
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