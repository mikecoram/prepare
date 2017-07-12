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
    const mainHandler = require('./handlers/main');
    app.get('/', [redirectToDashboard], mainHandler.home);
    app.get('/dashboard', [isLoggedIn], mainHandler.dashboard);

    const authController = require('./controllers/auth');
    authController.registerRoutes(app, passport);

    const authHandler = require('./handlers/auth');
    app.get('/signup', [redirectToDashboard], authHandler.signup);
    app.get('/login', [redirectToDashboard], authHandler.login);
    app.get('/logout', authHandler.logout);
    app.get('/forgottenpassword', [redirectToDashboard], authHandler.forgottenpassword);
    app.get('/resetpassword/:token', authHandler.resetPassword);
};