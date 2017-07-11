var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'emailAddress',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, emailAddress, password, done) {
        var generateHash = function (password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        }

        // Validation
        var validation = require('../lib/validation');
        if (!validation.isValidEmailAddress(emailAddress)) {
            return done(null, false);
        }
        if (!validation.isValidPassword(password)) {
            return done(null, false);
        }

        User.findOne({
            where: {
                emailAddress: emailAddress
            }
        }).then(function (user) {
            if (user) {
                return done(null, false, {
                    message: 'That email address is already in use.'
                });
            }
            else {
                var hashedPassword   = generateHash(password);
                var data = {
                    emailAddress: emailAddress,
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
    }));

    passport.use('local-signin', new LocalStrategy({
        usernameField: 'emailAddress',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, emailAddress, password, done) {
        var User = user;
        var passwordMatches = function(reqPassword, dbPassword) {
            return bCrypt.compareSync(dbPassword, reqPassword);
        }

        User.findOne({
            where: {
                emailAddress: emailAddress
            }
        }).then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: 'Email address does not exist.'
                });
            }
            if (!passwordMatches(user.password, password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            return done(null, user.get());
        }).catch(function (err) {
            console.log('Error:', err);
            return done(null, false, {
                message: 'Something went wrong during login, please try again later.'
            });
        });
    }));
}