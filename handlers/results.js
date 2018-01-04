const QuizResults = require('../lib/quiz-results');
const DateHelper = require('../lib/date-helper');
const UserHelper = require('../lib/user-helper');

exports.userResults = function(req, res) {
    UserHelper.getUser(req.params.userId).then((user) => {
        QuizResults.getFinishedQuizzes(user).then((quizzes) => {
            res.render('results/user', {
                tutor: true,
                authorised: req.user != undefined,
                quizzes: formatData(quizzes),
                hasQuizzes: quizzes.length != 0,
                heading: 'User Results'
            });
        });
    });
}

exports.myResults = function (req, res) {
    QuizResults.getFinishedQuizzes(req.user).then((quizzes) => {
        res.render('results/user', {
            authorised: req.user != undefined,
            quizzes: formatData(quizzes),
            hasQuizzes: quizzes.length != 0,
            heading:'My Results'
        });
    });
}

function formatData(raw) {
    let quizzes = [];
    let count = raw.length;

    raw.forEach((q) => {
        quizzes.push({
            number: count--,
            createdAt: DateHelper.format(q.createdAt),
            finishedOn: DateHelper.format(q.finishedOn),
            result: q.result
        });
    });

    return quizzes;
}