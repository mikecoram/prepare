const fs = require('fs');

const TEMPLATE_DIR = __dirname + '/templates';

exports.read = readQuizTemplateData;

function readQuizTemplateData() {
    let sections = [];
    let sectionDirs = fs.readdirSync(TEMPLATE_DIR);

    sectionDirs.forEach((sectionDir) => {
        let sectionTemplate = {}, 
            exampleTemplates = [], 
            questionTemplates = [], 
            valueGenerators = [];

        let contents = fs.readdirSync(TEMPLATE_DIR + '/' + sectionDir);
    
        contents.forEach((filename) => {
            let file = fs.readFileSync(TEMPLATE_DIR + '/' + sectionDir + '/' + filename, 'utf-8');
            let object = JSON.parse(file);
    
            if (filename.match('section_data')) {
                sectionTemplate = object;
            }
            else if (filename.match('ex_')) {
                exampleTemplates.push(object);
            }
            else if (filename.match('q_')) {
                questionTemplates.push(object);
            }
            else if (filename.match('vg_')) {
                valueGenerators.push(object);
            }
        });
    
        sections.push({
            sectionTemplate: sectionTemplate,
            exampleTemplates: exampleTemplates,
            questionTemplates: questionTemplates,
            valueGenerators: valueGenerators
        });
    });

    return sections;
}