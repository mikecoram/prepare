const QuizResults = require('../lib/quiz-results');
const DateHelper = require('../lib/date-helper');
const UserHelper = require('../lib/user-helper');

exports.userResults = function(req, res) {
    UserHelper.getUser(req.params.userId).then((user) => {
        QuizResults.getFinishedQuizzes(user).then((quizzes) => {
            res.render('results/user', {
                tutor: true,
                linkResults: true,
                userEmailAddress: user.emailAddress,
                authorised: req.user != undefined,
                quizzes: formatData(quizzes, true),
                hasQuizzes: quizzes.length != 0,
                heading: 'Quiz Results',
                graphData: JSON.stringify(createGraphData(quizzes))
            });
        });
    });
}

const TutorSettings = require('../lib/tutor-settings');

exports.myResults = async function (req, res) {
    let linkResults = await TutorSettings.userAllowed();
    
    QuizResults.getFinishedQuizzes(req.user).then((quizzes) => {
        res.render('results/user', {
            authorised: req.user != undefined,
            quizzes: formatData(quizzes, linkResults),
            hasQuizzes: quizzes.length != 0,
            heading:'My Quiz Results',
            graphData: JSON.stringify(createGraphData(quizzes))
        });
    });
}

function createGraphData(raw) {
    let marks = [];
    let labels = [];
    let count = 1;

    raw.reverse().forEach(q => {
        marks.push({y: q.result});
        labels.push(count++)
    });

    return {marks: marks, labels: labels};
}

function formatData(raw, linkResults) {
    let quizzes = [];
    let count = raw.length;

    raw.forEach((q) => {
        quizzes.push({
            id: q.id,
            number: count--,
            createdAt: DateHelper.format(q.createdAt),
            finishedOn: DateHelper.format(q.finishedOn),
            result: q.result,
            linkResults: linkResults
        });
    });

    return quizzes;
}