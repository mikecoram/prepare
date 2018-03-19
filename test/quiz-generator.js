const QuizGenerator = require('../lib/quiz-generator');

const TestTemplates = require('./lib/templates');
const TestUser = require('./lib/user');
const TestQuiz = require('./lib/quiz');

const { Quiz, Section, Question, Example, ValueGenerator } = require('../models');

describe('quiz generator', () => {
    it('generates quiz', done => {
        var test = async function() {
            let user = await TestUser.createTestUser();
            await TestTemplates.clearTemplates();
            await TestTemplates.createTemplates();

            let generatedQuiz = await QuizGenerator.generate(user, {
                graded: true,
                difficulty: 50
            });

            let quiz = await TestQuiz.getQuiz(generatedQuiz.id);

            console.log(quiz.sections.length == 2 
                , quiz.sections[0].questions.length == 2
                , quiz.sections[0].examples.length == 1
                , quiz.sections[1].questions.length == 1)

            console.log(quiz)

            return quiz.sections.length == 2 
            && quiz.sections[0].questions.length == 2
            && quiz.sections[0].examples.length == 1
            && quiz.sections[1].questions.length == 1; 
        };

        test().then(result => {
            if (result)
                done();
        });
    });
});