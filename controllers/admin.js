function _isAdmin(user) {
    return true;
}

exports.isAdmin = function (req, res, next) {
    if (_isAdmin(req.user)) {
        return next();
    }
    res.redirect('/login');
}