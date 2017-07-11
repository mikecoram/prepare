function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// If user is authenticated, redirect them if they attempt to view /signup or /signin
function redirectToDashboard(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dashboard');
}

module.exports = function (app, passport) {
    app.get('/', [redirectToDashboard], function (req, res) {
        res.render('home');
    });

    app.get('/signup', [redirectToDashboard], function (req, res) {
        res.render('signup', {errorMessage: req.flash('error')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/login', [redirectToDashboard], function (req, res) {
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

    app.get('/forgottenpassword', [redirectToDashboard], function (req, res) {
        res.render('forgottenpassword');
    });

    app.post('/forgottenpassword', function (req, res) {
        
    });

    app.get('/dashboard', [isLoggedIn], function (req, res) {
        res.render('dashboard', {
            authorised: req.user != undefined
        });
    });
};