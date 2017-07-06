var main = require('./handlers/main');

module.exports = function (app, passport) {
    app.get('/', main.home);

    app.get('/signup', function (req, res) {
        res.render('signup');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
    }));
};