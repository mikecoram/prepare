const TUTOR_ROLE = require('../constants').USER_ROLE.TUTOR;

exports.isTutor = function(req, res, next) {
    if (_isTutor(user)) {
        return next();
    }
    res.redirect('/login');
}

function _isTutor(user) {
    return user != undefined && user.role == TUTOR_ROLE;
}