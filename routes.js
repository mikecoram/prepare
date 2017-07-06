var main = require('./handlers/main');

module.exports = function (app, passport) {
    app.get('/', main.home);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
    }));
};