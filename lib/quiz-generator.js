const {
    SectionTemplate, ExampleTemplate, QuestionTemplate, ValueGenerator,
    Quiz, Section, Example, Question
} = require('../models');

const BULK_CREATE_OPTIONS =  {returning: true};

exports.generate = generate;

function generate(options) {
    return new Promise((resolve, reject) => {
        createQuiz(options.userId, options.graded, options.difficulty).then((quiz) => {
            generateSections(quiz).then(() => {
                resolve();
            });
        });
    });
}

function generateSections(quiz) {
    return new Promise((resolve, reject) => {
        getSectionTemplates().then((sectionTemplates) => {
            createSections(sectionTemplates, quiz.id).then((sections) => {
                sections.forEach((section) => {
                    createExamples(section.id, section.sectionTemplateId).then((examples) => {
                        createQuestions(section.id, section.sectionTemplateId, examples).then((result) => {
                            resolve(true);
                        });
                    });
                });
            });
        });
    });
}

function getSectionTemplates() {
    return new Promise((resolve, rejcet) => {
        SectionTemplate.findAll().then((sts) => {
            resolve(sts);
        }, (err) => {
            reject(err);
        });
    });
}

function createSections(sectionTemplates, quizId) {
    return new Promise((resolve, reject) => {
        let sections = [];
        let sectionCount = 0;
        

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
}

function createExamples(sectionId, sectionTemplateId) {
    return new Promise((resolve, reject) => {
        getExampleTemplates(sectionTemplateId).then((templates) => {
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

function createQuestions(sectionId, sectionTemplateId, examples) {
    return new Promise((resolve, reject) => {
        let questions = [];

        getQuestionTemplates(sectionTemplateId).then((questionTemplates) => {
            questionTemplates.forEach((qt) => {
                getValueGenerators(qt.id).then((valueGenerators) => {
                    // perform value generation
                    let values = [];
                    valueGenerators.forEach((vg) => {
                        values.push({
                            position: vg.valuePosition,
                            value: generateValue(vg)
                        });
                    });

                    // create question
                    questions.push({
                        position: qt.position,
                        sectionId: sectionId,
                        input: generateInput(qt.inputTemplate, values),
                        expectedOutput: generateOutput(qt.outputTemplate, values)
                    });
    
                    Question.bulkCreate(questions).then((questionsWithIds) => {
                        resolve(questionsWithIds);
                    });
    
                });
            });
        });
    });
}

function createQuiz(userId, graded, difficulty) {
    return new Promise((resolve, reject) => {
        Quiz.create({
            userId: userId,
            graded: graded,
            difficulty: difficulty
        }).then((result) => {
            resolve(result);
        });
    });
}

function getQuestionTemplates(sectionTemplateId) {
    return new Promise((resolve, reject) => {
        QuestionTemplate.findAll({
            where: {
                sectionTemplateId: sectionTemplateId
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

function getExampleTemplates(sectionTemplateId) {
    return new Promise((resolve, reject) => {
        ExampleTemplate.findAll({
            where: {
                sectionTemplateId: sectionTemplateId
            }
        }).then((results) => {
            resolve(results);
        });
    });
}

function generateValue(valueGenerator) {
    if (valueGenerator.type === 'string') {
        return "Hello, World!";
    }
    else if (valueGenerator.type === 'integer') {
        return getRandomInt(valueGenerator.min, valueGenerator.max);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive  
}

function generateInput(template, values) {
    return replaceAllValueMarkers(template, values);
}

function generateOutput(template, values) {
    let output = replaceAllValueMarkers(template, values);
    let evaluated;
    
    try {
        evaluated = eval(output);
    } catch (ex) {
        return ex;
    }
  
    return evaluated;
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
