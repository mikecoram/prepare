const TUTOR_ROLE = require('../constants').USER_ROLE.TUTOR;

exports.isTutor = function(req, res, next) {
    if (_isTutor(req.user)) {
        return next();
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