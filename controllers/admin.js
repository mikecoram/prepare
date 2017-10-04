var ROLES = require('../constants').USER_ROLE;

function _isAdmin(user) {
    return user != undefined && user.role === ROLES.ADMIN;
}

exports.isAdmin = function (req, res, next) {
    if (_isAdmin(req.user)) {
        return next();
    }
    res.redirect('/login');
}