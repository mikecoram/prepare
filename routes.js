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

    let quizHandler = require('./handlers/quiz');
    app.get('/quiz', [isLoggedIn], quizHandler.quiz);
    app.post('/quiz/new', [isLoggedIn], quizHandler.generateNewQuiz);
    app.get('/quiz/section/:sectionNum', [isLoggedIn], quizHandler.quizSection);
    app.post('/quiz/answers', [isLoggedIn], quizHandler.uploadAnswers);

    var adminController = require('./controllers/admin');
    // Admin middleware
    var isAdmin = adminController.isAdmin;

    app.get('/admin', [isAdmin], require('./handlers/admin').dashboard);
};
