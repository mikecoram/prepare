const QuizSections = require('../lib/quiz-sections');

const TestUser = require('./lib/user');
const TestQuiz = require('./lib/quiz');

describe('quiz sections', () => {
    it('get sections', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.generateQuiz(user);

            return await QuizSections.getSections(user, 1, quiz.id);
        }

        test().then(sections => {
            if (sections.length > 0 && sections[0].current == true)
                done();
        });
    });

    it('gets section data', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.generateQuiz(user);

            return await QuizSections.getSectionData(user, 1, quiz.id);
        }

        test().then(sectionData => {
            if (sectionData)
                done();
        });
    });

    it('gets the earliest unfinished quiz', done => {
        let test = async function() {
            let user = await TestUser.createTestUser();
            let quiz = await TestQuiz.generateQuiz(user);

            return await QuizSections.getEarliestUnfinishedSectionNum(quiz);
        }

        test().then(sectionNum => {
            if (sectionNum == 1)
                done();
        });
    });
});