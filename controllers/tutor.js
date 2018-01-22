const TUTOR_ROLE = require('../constants').USER_ROLE.TUTOR;

exports.isTutor = function(req, res, next) {
    if (_isTutor(req.user)) {
        return next();
    }
    res.redirect('/login');
}

const TutorSettings = require('../lib/tutor-settings');
const QuizUser = require('../lib/quiz-user');
const GLOBAL_SETTING_TITLES = require("../constants").GLOBAL_SETTING_TITLES;

exports.tutorOrUserIfAllowed = async function(req, res, next) {
    if (_isTutor(req.user)) {
        return next();
    }
    else {
        let userAllowed = await TutorSettings.userAllowed();
        if (userAllowed) {
            // check user is viewing one of their own quizzes
            let quizBelongsToUser = await QuizUser.quizBelongsToUser(req.user.id, req.params.quizId);

            if (quizBelongsToUser) {
                return next();
            }
        }
    }
    res.redirect('/login');
}

function _isTutor(user) {
    if (user) {
        return user.role == TUTOR_ROLE;
    }
    else {
        return false;
    }
}