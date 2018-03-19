exports.getSections = getSections;
exports.getSectionData = getSectionData;
exports.getEarliestUnfinishedSectionNum = getEarliestUnfinishedSectionNum;

const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');

const SECTION_SORT = (a, b) => {return a.number - b.number;};

async function getSections(user, currentSectionNum, quizId) {
    let quiz = await Quiz.find({
        where: createWhereQuery(user, quizId),
        include: [{
            model: Section,
            as: 'sections'
        }]
    });

    return formatSectionData(quiz.sections, currentSectionNum, quizId)
        .sort(SECTION_SORT);
}

function formatSectionData(rawSections, currentSectionNum, quizId) {
    let sections = [];

    for (let section of rawSections) {
        sections.push({
            number: section.number,
            current: section.number == currentSectionNum,
            url: !quizId ? 
                `/quiz/section/${section.number}` : 
                `/quiz/${quizId}/section/${section.number}`
        });
    }

    return sections;
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

const POS_SORT = (a, b) => {return a.position - b.position;};
const EXAMPLE_POS_SORT = (a, b) => {return a.exampleTemplate.position - b.exampleTemplate.position;};

async function getSectionData(user, sectionNum, quizId) {
    let quiz = await Quiz.find({
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
    });

    return createSectionData(
        quiz.sections[0].examples.sort(POS_SORT), 
        quiz.sections[0].questions.sort(POS_SORT),
        quizId != undefined
    );
}

function createSectionData(examples, questions, quizFinished) {
    let sectionData = [];
    let sortedExamples = examples.sort(EXAMPLE_POS_SORT);

    if (!quizFinished) {
        for (let e of sortedExamples) {
            sectionData.push({
                id: e.id,
                input: e.exampleTemplate.input,
                output: e.exampleTemplate.output,
                position: e.exampleTemplate.position,
                disabled: true,
                example: true,
                first: e == sortedExamples[0]
            });
        }
    }

    for (let q of questions) {
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
    }

    return sectionData.sort(POS_SORT);
}

async function getEarliestUnfinishedSectionNum(quiz) {
    let section = await Section.find({
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
    });

    return section ? section.number : 1;
}