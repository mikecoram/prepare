const {
    SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator,
    Quiz, Section, Example, Question
} = require('../models');
const Op = require('sequelize').Op;

const QuizUser = require('./quiz-user');

const BULK_CREATE_OPTIONS =  {returning: true};

exports.generate = generate;

async function generate(user, options) {
    let quiz = await createQuiz(user, options.graded, options.difficulty)
    await createQuizContent(quiz)
    return quiz;
}

async function createQuiz(user, graded, difficulty) {
    let newDifficulty = await QuizUser.getNewDifficulty(user);
    let result = await Quiz.create({
        userId: user.id,
        graded: graded,
        difficulty: newDifficulty
    });
    return result;
}

async function createQuizContent(quiz) {
    let sections = await createSections(quiz.id, quiz.difficulty);

    for (let section of sections) {
        await createExamples(section.id, section.sectionTemplateId, quiz.difficulty);
        await createQuestions(section.id, section.sectionTemplateId, quiz.difficulty);
    }
}

async function createSections(quizId, quizDifficulty) {
        let sectionTemplates = await getSectionTemplates(quizDifficulty);

        let sections = [];
        let sectionCount = 1;

        for (let sectionTemplate of sectionTemplates) {
            sections.push({
                quizId: quizId,
                sectionTemplateId: sectionTemplate.id,
                number: sectionCount++,
                extraLength: 0
            });
        }

        return await Section.bulkCreate(sections, BULK_CREATE_OPTIONS);
}

async function getSectionTemplates(quizDifficulty) {
    return await SectionTemplate.findAll({
        where: {
            difficulty: {
                [Op.lte]: quizDifficulty
            }
        }
    });
}

async function createExamples(sectionId, sectionTemplateId, quizDifficulty) {
    let templates = await getExampleTemplates(sectionTemplateId, quizDifficulty);

    let examples = [];

    for (let template of templates) {
        examples.push({
            sectionId: sectionId,
            exampleTemplateId: template.id
        });
    }
    
    return await Example.bulkCreate(examples);
}

async function createQuestions(sectionId, sectionTemplateId, quizDifficulty) {
    let questions = [];
    let seq = [];

    let templates = await getQuestionTemplates(sectionTemplateId, quizDifficulty);

    for (let template of templates) {
        questions.push(await createQuestion(template, sectionId));
    }

    return await Question.bulkCreate(questions);
}

async function createQuestion(questionTemplate, sectionId) {
    let valueGenerators = await getValueGenerators(questionTemplate.id);

    // perform value generation
    let values = [];
    for (let vg of valueGenerators) {
        values.push({
            position: vg.valuePosition,
            value: generateValue(vg)
        });
    }

    // create question
    return {
        position: questionTemplate.position,
        sectionId: sectionId,
        input: generateInput(questionTemplate.inputTemplate, values),
        expectedOutput: generateOutput(questionTemplate.outputTemplate, values)
    };
}

async function getQuestionTemplates(sectionTemplateId, quizDifficulty) {
    return await QuestionTemplate.findAll({
        where: {
            sectionTemplateId: sectionTemplateId,
            difficulty: {
                [Op.lte]: quizDifficulty
            }
        }
    });
}

async function getValueGenerators(questionTemplateId) {
    return await ValueGenerator.findAll({
        where: {
            questionTemplateId: questionTemplateId
        }
    });
}

async function getExampleTemplates(sectionTemplateId, quizDifficulty) {
    return await ExampleTemplate.findAll({
        where: {
            sectionTemplateId: sectionTemplateId,
            difficulty: {
                [Op.lte]: quizDifficulty
            }
        }
    });
}

function generateInput(template, values) {
    return replaceAllValueMarkers(template, values);
}

const RANDOM_STRINGS = [
    'promote', 'east', 'behave', 'unpleasant', 'spend', 'chew', 'sticky', 'temptation', 'mention', 'marathon', 'view', 'confine', 'growth', 'present', 'litigation', 'interface', 'lodge', 'incredible', 'prediction', 'hunting', 'clear', 'stubborn', 'nice', 'sell', 'sentence', 'wellness', 'flush', 'charge', 'equinox', 'smash', 'produce', 'ballet', 'equal', 'judge', 'identity', 'nomination', 'ring', 'illustrate', 'innovation', 'member', 'decrease', 'trance', 'dribble', 'similar', 'dive', 'fog', 'participate', 'petty', 'guilt', 'fire'
];

function generateValue(valueGenerator) {
    if (valueGenerator.type === 'string') {
        return '\"' + RANDOM_STRINGS[getRandomInt(0, RANDOM_STRINGS.length)] + '\"';
    }
    else if (valueGenerator.type === 'integer') {
        return getRandomInt(valueGenerator.min, valueGenerator.max);
    }
    else if (valueGenerator.type = 'even-integer') {
        return 2 * Math.round(getRandomInt(valueGenerator.min, valueGenerator.max) / 2);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive  
}

function generateOutput(template, values) {
    let evaluateCode = replaceAllValueMarkers(template, values);
    let output;
    
    try {
        output = eval(evaluateCode);
    } catch (ex) {
        return ex;
    }
  
    return output;
}

function replaceAllValueMarkers(template, values) {
	let result = template;
    values.forEach((v) => {
        result = replaceValueMarker(result, v.position, v.value);
    });
    return result;
}

function replaceValueMarker(template, position, value) {
    let regex = new RegExp('\\$\\{'+position+'}', 'g');
    return template.replace(regex, value);
}
