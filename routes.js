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

const auth = require('./handlers/auth');

module.exports = function (app, passport) {
    app.get('/', [redirectToDashboard], function (req, res) {
        res.render('home');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', [redirectToDashboard], auth.signup);
    app.get('/login', [redirectToDashboard], auth.login);
    app.get('/logout', auth.logout);
    app.get('/forgottenpassword', [redirectToDashboard], auth.forgottenpassword);

    app.post('/forgottenpassword', function (req, res) {
        
    });

    app.get('/dashboard', [isLoggedIn], function (req, res) {
        res.render('dashboard', {
            authorised: req.user != undefined
        });
    });
};