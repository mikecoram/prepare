var main = require('./handlers/main');

module.exports = function (app, passport) {
    app.get('/', main.home);

    app.get('/dashboard', isLoggedIn, function (req, res) {
        res.send('dashboard');
    });

    app.get('/signup', function (req, res) {
        res.render('signup', {errorMessage: req.flash('error')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/login', function (req, res) {
        res.render('login', {errorMessage: req.flash('error')});
    });

    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/signin');
    }
};