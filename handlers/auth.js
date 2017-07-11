exports.signup = function (req, res) {
    res.render('signup', {errorMessage: req.flash('error')});
};

exports.login = function (req, res) {
    res.render('login', {errorMessage: req.flash('error')});
};

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}

exports.forgottenpassword = function (req, res) {
    res.render('forgottenpassword');
}