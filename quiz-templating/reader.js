const fs = require('fs');

const TEMPLATE_DIR = __dirname + '/section-templates';

exports.read = read;

function read() {
    let sectionTemplates = [];

    getTemplateData(TEMPLATE_DIR).forEach((sd) => {
        let sectionTemplate = sd.info, 
            exampleTemplates = [], 
            questionTemplates = [], 
            valueGenerators = [];
    
        let pos = 0;
    
        sd.entries.forEach((e) => {
            if (isExample(e)) {
                exampleTemplates.push({
                    position: pos++,
                    input: e.input,
                    output: e.output,
                    difficulty: e.difficulty || 0
                });
            }
            else {
                let valuePos = 1;
    
                if (e.valueGenerators) {
                    e.valueGenerators.forEach((vg) => {
                        valueGenerators.push({
                            questionPosition: pos,
                            valuePosition: valuePos++,
                            type: vg.type,
                            min: vg.min,
                            max: vg.max
                        });
                    });
                }
    
                questionTemplates.push({
                    position: pos++,
                    inputTemplate: e.inputTemplate,
                    outputTemplate: getOutputTemplate(
                        e.output, 
                        e.valueGenerators ? e.valueGenerators.length : 0
                    ),
                    difficulty: e.difficulty
                });
            }
        });

        sectionTemplates.push({
            sectionTemplate: sectionTemplate,
            exampleTemplates: exampleTemplates,
            questionTemplates: questionTemplates,
            valueGenerators: valueGenerators
        });
    });

    return sectionTemplates;
}

function getTemplateData(templateDir) {
    let data = [];
    let sections = fs.readdirSync(templateDir);

    sections.forEach((sd) => {
        data.push(require(templateDir + '/' + sd));
    });

    return data;
}

function isExample(entry) {
    return entry.input != undefined;
}

function getParameterString(amount) {
    let paramString = '';
    
    for (let i = 1; i <= amount; i++) {
        paramString += '${'+ i + '}';
        if (i != amount) {
            paramString += ', ';
        }
    }
    
    return paramString;
}

function getOutputTemplate(func, args) {
    return `let f = ${func.toString()}; f(${getParameterString(args)});`;
}