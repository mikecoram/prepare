function _isAdmin(user) {
    var ROLES = require('../const').ROLES;
    return user.role === ROLES.ADMIN;
}

exports.isAdmin = function (req, res, next) {
    if (_isAdmin(req.user)) {
        return next();
    }
    res.redirect('/login');
}