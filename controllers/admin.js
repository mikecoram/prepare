var USER_ROLE = require(__base + '/constants').USER_ROLE;

exports.isAdmin = function (req, res, next) {
    if (_isAdmin(req.user)) {
        return next();
    }
    res.redirect('/login');
}

function _isAdmin(user) {
    return user != undefined && user.role === USER_ROLE.ADMIN;
}