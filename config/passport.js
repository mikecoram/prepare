var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', {
        usernameField: 'emailAddress',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, emailAddress, password, done) {
        var generateHash = function (password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        }

        User.findOne({
            where: {
                emailAddress: emailAddress
            }
        }).then(function (user) {
            if (user) {
                return done(null, false, {
                    message: 'Email address is already in use.'
                });
            }
            else {
                var hashedPassword = generateHash(password);
                var data = {
                    email: email,
                    password: hashedPassword
                };

                User.create(data).then(function (newUser, created) {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        return done(null, newUser);
                    }
                });
            }
        });
    });
}