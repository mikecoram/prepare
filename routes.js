function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function redirectToAuthArea(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dashboard');
}

module.exports = function (app, passport) {
    app.get('/', [redirectToAuthArea], function (req, res) {
        res.render('home');
    });

    app.get('/signup', [redirectToAuthArea], function (req, res) {
        res.render('signup', {errorMessage: req.flash('error')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/login', [redirectToAuthArea], function (req, res) {
        res.render('login', {errorMessage: req.flash('error')});
    });

    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

    app.get('/dashboard', [isLoggedIn], function (req, res) {
        res.render('dashboard', {
            authorised: req.user != undefined
        });
    });
};