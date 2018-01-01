const { Quiz, Section, Question, Example, ExampleTemplate } = require('../models/');
const QuizMarker = require('../lib/quiz-marker');
const QuizSections = require('../lib/quiz-sections');
const QuizAnswers = require('../lib/quiz-answers');
const QuizGenerator = require(__base + '/lib/quiz-generator');
const QuizUser = require(__base + '/lib/quiz-user');
const QuizResults = require('../lib/quiz-results');

exports.intro = function(req, res) {
    res.render('quiz/intro', {
        authorised: req.user != undefined
    });
}

exports.quiz = function(req, res) {
    QuizUser.getQuiz(req.user).then((quiz) => {
        if (quiz) {
            QuizSections.getEarliestUnfinishedSectionNum(quiz)
            .then((currentSectionNum) => {
                res.redirect('/quiz/section/' + currentSectionNum + 
                    '?tutorial=' + (req.query.tutorial || false));
            });
        }
        else {
            res.redirect('/quiz/intro');
        }
    });
}

exports.quizSection = function(req, res) {
    Promise.all([
        QuizSections.getSections(req.user, req.params.sectionNum),    
        QuizSections.getSectionData(req.user, req.params.sectionNum)
    ]).then((results) => {
        let sections = results[0];
        let sectionData = results[1];

        let sectionNum = Number.parseInt(req.params.sectionNum);

        res.render('quiz/section', {
            authorised: req.user != undefined,
            sections: sections,
            sectionData: sectionData,
            hidePreviousBtn: sectionNum == sections[0].number,
            hideNextBtn: sectionNum == sections[sections.length - 1].number,
            showPreviousBtn: sectionNum != sections[0].number,
            showNextBtn: sectionNum != sections[sections.length - 1].number,
            previousSectionNum: sectionNum - 1,
            sectionNum: sectionNum,
            nextSectionNum: sectionNum + 1,
            showTutorial: req.query.tutorial || false
        });
    });
}

exports.generateNewQuiz = function(req, res) {
    QuizUser.hasQuiz(req.user).then((hasQuiz) => {
        if (hasQuiz) {
            res.redirect('/quiz');
        }
        else {
            console.log('Generating new quiz...')
            QuizGenerator.generate({
                userId: req.user.id,
                graded: false,
                difficulty: 0
            }).then(() => {
                res.redirect('/quiz?tutorial=true');
            }, (err) => {
                console.log(err);
            });        
        }
    });
}

exports.finish = function(req, res) {
    QuizMarker.markQuiz(req.user).then((result) => {
        res.redirect('/quiz/results');
    });
}

exports.results = function(req, res) {
    QuizResults.getLatestQuizResult(req.user).then((result) => {
        res.render('quiz/results', {
            authorised: req.user != undefined,
            result: result,
            completed: false
        });
    }, (err) => {
        console.log(err);
        res.render('error');
    });
}

exports.uploadAnswers = function(req, res) {
    QuizAnswers.uploadAnswers(req.user, req.body.answers, req.body.sectionNum).then((result) => {
        res.status(result.status).send(result.response);
    }, (err) => {
        console.log(err);
        res.status(500).send('Failed to upload!');
    });
}