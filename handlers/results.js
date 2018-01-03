const QuizResults = require('../lib/quiz-results');

exports.userResults = function(req, res) {
    QuizResults.getFinishedQuizzes(req.user).then((quizzes) => {
        res.render('results/user', {
            authorised: req.user != undefined,
            quizzes: formatData(quizzes),
            hasQuizzes: quizzes.length != 0,
            heading: req.params.userId == 'my' ? 'My Results' : 'User Results'
        });
    });
}

function formatData(raw) {
    let quizzes = [];
    let count = raw.length;

    raw.forEach((q) => {
        quizzes.push({
            number: count--,
            createdAt: formatDate(q.createdAt),
            finishedOn: formatDate(q.finishedOn),
            result: q.result
        });
    });

    return quizzes;
}

const DATE_FORMAT_OPTIONS = {  
    weekday: "long", year: "numeric", month: "short",  
    day: "numeric", hour: "2-digit", minute: "2-digit"  
};

function formatDate(date) {
    return date.toLocaleTimeString('en-uk', DATE_FORMAT_OPTIONS);
}