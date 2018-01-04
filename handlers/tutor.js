const QuizResults = require('../lib/quiz-results');

exports.tutorDashboard = function(req, res) {
    QuizResults.getUsersWithResultInfo().then((students) => {
        res.render('tutor/dashboard', {
            hasStudents: students.length != 0,
            students: students
        });    
    });
}