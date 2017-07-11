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

const main = require('./handlers/main');
const auth = require('./handlers/auth');

module.exports = function (app, passport) {
    app.get('/', [redirectToDashboard], main.home);
    app.get('/dashboard', [isLoggedIn], main.dashboard);

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

    app.post('/forgottenpassword', function (req, res) {
        
    });

    app.get('/signup', [redirectToDashboard], auth.signup);
    app.get('/login', [redirectToDashboard], auth.login);
    app.get('/logout', auth.logout);
    app.get('/forgottenpassword', [redirectToDashboard], auth.forgottenpassword);
};