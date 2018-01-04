const QuizResults = require('../lib/quiz-results');

exports.tutorDashboard = function(req, res) {
    QuizResults.getUsersWithResultInfo().then((students) => {
        res.render('tutor/dashboard', {
            tutor: true,
            authorised: true,
            hasStudents: students.length != 0,
            students: students
        });    
    });
}