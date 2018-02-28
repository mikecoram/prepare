const {
    SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator,
    Quiz, Section, Example, Question
} = require('../models');
const Op = require('sequelize').Op;

const QuizUser = require('./quiz-user');

const BULK_CREATE_OPTIONS =  {returning: true};

exports.generate = generate;

function generate(user, options) {
    return new Promise((resolve, reject) => {
        createQuiz(user, options.graded, options.difficulty).then((quiz) => {
            createQuizContent(quiz).then(() => {
                resolve();
            });
        });
    });
}

function createQuiz(user, graded, difficulty) {
    return new Promise((resolve, reject) => {
        QuizUser.getNewDifficulty(user).then((newDifficulty) => {
            Quiz.create({
                userId: user.id,
                graded: graded,
                difficulty: newDifficulty
            }).then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        }, (err) => {
            reject(err);
        });
    });
}

function createQuizContent(quiz) {
    return new Promise((resolve, reject) => {
        createSections(quiz.id, quiz.difficulty).then((sections) => {
            let seq = [];

            sections.forEach((section) => {
                seq.push(createExamples(section.id, section.sectionTemplateId, quiz.difficulty));
                seq.push(createQuestions(section.id, section.sectionTemplateId, quiz.difficulty));
            });

            Promise.all(seq).then((results) => {
                resolve();
            }, (err) => {
                reject(err);
            });            
        });
    });
}

function createSections(quizId, quizDifficulty) {
    return new Promise((resolve, reject) => {
        getSectionTemplates(quizDifficulty).then((sectionTemplates) => {
            let sections = [];
            let sectionCount = 1;

            sectionTemplates.forEach((st) => {
                sections.push({
                    quizId: quizId,
                    sectionTemplateId: st.id,
                    number: sectionCount++,
                    extraLength: 0
                });
            });

            Section.bulkCreate(sections, BULK_CREATE_OPTIONS).then((sectionsWithId) => {
                resolve(sectionsWithId);
            });
        });
    });
}

function getSectionTemplates(quizDifficulty) {
    return new Promise((resolve, rejcet) => {        
        SectionTemplate.findAll({
            where: {
                difficulty: {
                    [Op.lte]: quizDifficulty
                }
            }
        }).then((sts) => {
            resolve(sts);
        }, (err) => {
            reject(err);
        });
    });
}

function createExamples(sectionId, sectionTemplateId, quizDifficulty) {
    return new Promise((resolve, reject) => {
        getExampleTemplates(sectionTemplateId, quizDifficulty).then((templates) => {
            let examples = [];

            templates.forEach((template) => {
                examples.push({
                    sectionId: sectionId,
                    exampleTemplateId: template.id
                });
            });
    
            Example.bulkCreate(examples).then((examplesWithId) => {
                resolve(examplesWithId);
            });
        });
    });
}

function createQuestions(sectionId, sectionTemplateId, quizDifficulty) {
    return new Promise((resolve, reject) => {
        let questions = [];
        let seq = [];

        getQuestionTemplates(sectionTemplateId, quizDifficulty).then((questionTemplates) => {
            let questions = [];
            let seq = [];

            questionTemplates.forEach((qt) => {
                seq.push(createQuestion(qt, sectionId));
            });

            Promise.all(seq).then((questions) => {
                Question.bulkCreate(questions).then((questionsWithIds) => {
                    resolve(questionsWithIds);
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    });
}

function createQuestion(questionTemplate, sectionId) {
    return new Promise((resolve, reject) => {
        getValueGenerators(questionTemplate.id).then((valueGenerators) => {
            // perform value generation
            let values = [];
            valueGenerators.forEach((vg) => {
                values.push({
                    position: vg.valuePosition,
                    value: generateValue(vg)
                });
            });

            // create question
            resolve({
                position: questionTemplate.position,
                sectionId: sectionId,
                input: generateInput(questionTemplate.inputTemplate, values),
                expectedOutput: generateOutput(questionTemplate.outputTemplate, values)
            });
        }, (err) => {
            reject(err);
        });
    });
}

function getQuestionTemplates(sectionTemplateId, quizDifficulty) {
    return new Promise((resolve, reject) => {
        QuestionTemplate.findAll({
            where: {
                sectionTemplateId: sectionTemplateId,
                difficulty: {
                    [Op.lte]: quizDifficulty
                }
            }
        }).then((results) => {
            resolve(results);
        });    
    });
}

function getValueGenerators(questionTemplateId) {
    return new Promise((resolve, reject) => {
        ValueGenerator.findAll({
            where: {
                questionTemplateId: questionTemplateId
            }
        }).then((results) => {
            resolve(results);
        });
    });
}

function getExampleTemplates(sectionTemplateId, quizDifficulty) {
    return new Promise((resolve, reject) => {
        ExampleTemplate.findAll({
            where: {
                sectionTemplateId: sectionTemplateId,
                difficulty: {
                    [Op.lte]: quizDifficulty
                }
            }
        }).then((results) => {
            resolve(results);
        });
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
