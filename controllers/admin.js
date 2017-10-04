var ROLES = require('../constants').ROLES;

function _isAdmin(user) {
    return user.role === ROLES.ADMIN;
}

exports.isAdmin = function (req, res, next) {
    if (_isAdmin(req.user)) {
        return next();
    }
    res.redirect('/login');
}