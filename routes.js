module.exports = function (app) {
    var authController = require('./controllers/auth');
    var isLoggedIn = authController.isLoggedIn;
    var redirectToDashboard = authController.redirectToDashboard;

    authController.registerRoutes(app);

    var mainHandler = require('./handlers/main');
    app.get('/', [redirectToDashboard], mainHandler.home);
    app.get('/dashboard', [isLoggedIn], mainHandler.dashboard);

    var authHandler = require('./handlers/auth');
    app.get('/signup', [redirectToDashboard], authHandler.signup);
    app.get('/login', [redirectToDashboard], authHandler.login);
    app.get('/logout', authHandler.logout);
    app.get('/forgottenpassword', [redirectToDashboard], authHandler.forgottenpassword);
    app.get('/resetpassword/:token', authHandler.resetPassword);
};