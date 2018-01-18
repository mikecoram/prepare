const QuizResults = require('../lib/quiz-results');

exports.tutorDashboard = async function(req, res) {
    let students = await QuizResults.getUsersWithResultInfo();
    res.render('tutor/dashboard', {
        tutor: true,
        authorised: true,
        hasStudents: students.length != 0,
        students: students
    });
}

const TutorSettings = require('../lib/tutor-settings');

exports.settings = async function(req, res) {
    let settings = await TutorSettings.all();
    res.render('tutor/settings', {
        tutor: true,
        authorised: true,
        settings: settings
    })
}

exports.saveSettings = async function(req, res) {
    await TutorSettings.save(req.body);
    res.redirect('/tutor/settings');
}