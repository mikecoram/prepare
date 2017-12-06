generateTest = (options) => {
    let quiz = new Quiz();

    createSections(options.sectionTemplates).then((sections) => {
        sections.each((section) => {
            createExamples(section.id).then((examples) => {
                
            });
        });
    });

}

function createSections(sectionTemplates) {
    let sections = [];
    sectionTemplates.each((st) => {
        sections.push({
            sectionTemplateId: st.Id,
            number: sectionCount++,
            extraLength: options.extraLength
        });
    });
    
    return Section.bulkCreate(sections);
}

function createExamples(sectionId) {
    return getExampleTemplates.then((results) => {
        let examples = [];

        results.each((template) => {
            examples.push({
                sectionId: sectionId,
                templateId: templateId
            });
        });

        return Example.bulkCreate(examples);
    });
}

function createQuestions(sectionId, sectionTemplateId, examples) {
    let questions = [];

    return getQuestionTemplates(sectionTemplateId).then((templates) => {
        templates.foreach((template) => {
            let generatedValues = [];

            getGenerateValues(template.id).then((generateValues) => {
                generateValues.foreach((gv) => {
                    generatedValues.push(performValueGeneration(gv));
                });

                questions.push({
                    sectionId: sectionId,
                    input: generateInput(template.inputTemplate, generatedValues),
                    expectedOutput: generateOutput(template.outputTemplate, generatedValues)
                });
            });
        });

        return questions;
    });
}

function getQuestionTemplates(stId) {
    return QuestionTemplate.find({
        where: {
            sectionTemplateId: stId
        }
    }).then((results) => {
        return results;
    });
}

function getGenerateValues(qtId) {
    return GenerateValue.find({
        where: {
            questionTemplateId: qtId
        }
    }).then((results) => {
        return results;
    });
}

function getExampleTemplates(stId) {
    return ExampleTemplate.find({
        where: {
            sectionTemplateId: stId
        }
    }).then((results) => {
        return results;
    });
}

function performValueGeneration(generateValue) {
    if (generateValue.type === 'string') {
        return "Hello, World!";
    }
    else if (generateValue.type === 'int') {
        return getRandomInt(generateValue.min, generateValue.max);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive  
}

function generateInput(template, generatedValues) {
    return "";
}

function generateOutput(template, generatedValues) {
    return "";
}