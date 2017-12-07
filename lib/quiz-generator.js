function generateTest(options) {
    let quiz = new Quiz();

    return new Promise((resolve, reject) => {
        createSections(options.sectionTemplates).then((sections) => {
            sections.each((section) => {
                createExamples(section.id).then((examples) => {
                    createQuestions(section.id, section.sectionTemplateId, examples).then((result) => {
                        createQuiz(options.userId, options.graded, options.difficulty).then((result) => {
                            resolve(true);
                        });
                    });
                });
            });
        });    
    });
}

function createSections(sectionTemplates) {
    return new Promise((resolve, reject) => {
        let sections = [];
        sectionTemplates.each((st) => {
            sections.push({
                sectionTemplateId: st.Id,
                number: sectionCount++,
                extraLength: options.extraLength
            });
        });
        
        Section.bulkCreate(sections).then((sectionsWithId) => {
            resolve(sectionsWithId);
        });
    });
}

function createExamples(sectionId) {
    return new Promise((resolve, reject) => {
        getExampleTemplates.then((results) => {
            let examples = [];
    
            results.each((template) => {
                examples.push({
                    sectionId: sectionId,
                    templateId: templateId
                });
            });
    
            Example.bulkCreate(examples).then((examplesWithId) => {
                resolve(examplesWithId);
            });
        });
    });
}

function createQuestions(sectionId, sectionTemplateId, examples) {
    // examples ordered by position (assume example has position)
    // foreach example, get all question templates after that example
    // generate them, increment positionCounter
    // move to next example, reset the position counter

    return new Promise((resolve, reject) => {
        let posCount = 1;
        let questions = [];

        getQuestionTemplates.then((results) => {
            let questionTemplates = results;

            examples.each((e) => {
                posCount = 1;
                qts = questionTemplates.where((qt) => {return qt.afterExampleTemplate == e.exampleTemplate.Id});
                
                qts.each((qt) => {
                    getValueGenerators(qt.id).then((results) => {
                        let valueGenerators = results;
                        
                        // perform value generation
                        let values = [];
                        valueGenerators.each((vg) => {
                            values.push({
                                position: vg.position, 
                                value: generateValue(vg)
                            });
                        });
                    
                        // create question
                        questions.push({
                            afterExample: e.Id,
                            position: posCount++,
                            sectionId: sectionId,
                            input: generateInput(template.inputTemplate, values),
                            expectedOutput: generateOutput(template.outputTemplate, values)
                        });
                        
                        Question.bulkCreate(questions).then((questionsWithIds) => {
                            resolve(questionsWithIds);
                        });

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
        QuestionTemplate.find({
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
        ValueGenerators.find({
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
        ExampleTemplate.find({
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
    else if (valueGenerator.type === 'int') {
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

function replaceValueMarker(template, position, value) {
	let regex = new RegExp('\\$\\{'+position+'}', 'g');
  return template.replace(regex, value);
}

function replaceAllValueMarkers(template, values) {
	let result = template;
  values.forEach((v) => {
  	result = replaceValueMarker(result, v.position, v.value);
  });
  return result;
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