exports.main = function (app) {
    var authController = require('./controllers/auth');
    // Auth middleware
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

    var User = require('./models').User;
    var AdminController = require('./controllers/admin');

    app.get('/admin', [AdminController.isAdmin], function (req, res) {
        User.findAll({
            attributes: ['emailAddress', 'status', 'createdAt', 'updatedAt']
        }).then(function (users) {
            res.render('admin/home', {
                layout: 'admin',
                users: users
            });    
        });
    });
};
