exports.markQuiz = markQuiz;

const { Quiz, Section, Question } = require('../models/');

async function markQuiz(user) {
    let quiz = await Quiz.find({
        where: {
            userId: user.id,
            finishedOn: null
        },
        include: [{
            model: Section,
            as: 'sections',
            include: [{
                model: Question,
                as: 'questions'
            }]
        }]
    });

    // mark questions
    let results = await markQuestions(quiz);

    // grade quiz and set to finished
    await Quiz.update({
        finishedOn: new Date(),
        result: gradeQuiz(results, quiz.difficulty)
    }, {
        where: {
            userId: user.id,
            finishedOn: null
        }
    });
}

async function markQuestions(quiz) {
    let results = [];
    
    for (let section of quiz.sections) {
        for (let question of section.questions) {
            let result = markQuestion(question);
            results.push(result);

            await Question.update({
                correct: result
            }, {
                where: {
                    id: question.id
                }
            });
        }
    }

    return results;
}

function markQuestion(question, difficulty) {
    // Some questions are meant to be left blank
    if (question.expectedOutput == '' && question.userOutput == null) {
        return true;
    } 
    
    let uo = cleanOutput(question.userOutput);
    let eo = cleanOutput(question.expectedOutput);

    if (uo) {
        return uo == eo;
    }
    else {
        return false;
    }
}

function cleanOutput(output) {
    if (output) {
        return output.replace(/\t/g, '').replace(/\r?\n|\r/g, '').trim();
    }
}

function gradeQuiz(results) {
    return (results.filter((r) => {return r == true;}).length / results.length) * 100;
}