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
    app.get('/forgottenpassword', [redirectToDashboard], authHandler.forgottenpassword);
    app.get('/logout', authHandler.logout);
    app.get('/resetpassword/:token', authHandler.resetPassword);

    let quizHandler = require('./handlers/quiz');
    app.get('/quiz', [isLoggedIn], quizHandler.quiz);
    app.post('/quiz/new', [isLoggedIn], quizHandler.new);
    app.get('/quiz/intro', [isLoggedIn], quizHandler.intro);
    app.get('/quiz/section/:sectionNum', [isLoggedIn], quizHandler.section);
    app.post('/quiz/answers', [isLoggedIn], quizHandler.uploadAnswers);
    app.post('/quiz/finish', [isLoggedIn], quizHandler.finish);
    app.get('/quiz/results', [isLoggedIn], quizHandler.results);
    
    
    let resultsHandler = require('./handlers/results');
    app.get('/myresults', [isLoggedIn], resultsHandler.myResults);
    
    const tutorHandler = require('./handlers/tutor');
    const tutorController = require('./controllers/tutor');
    app.get('/tutor', [tutorController.isTutor], tutorHandler.tutorDashboard);
    app.get('/tutor/settings', [tutorController.isTutor], tutorHandler.settings);
    app.post('/tutor/settings', [tutorController.isTutor], tutorHandler.saveSettings);
    app.get('/results/user/:userId', [tutorController.isTutor], resultsHandler.userResults);
    app.get('/quiz/:quizId/section/:sectionNum', [tutorController.isTutor], quizHandler.finishedSection);
    
    var adminController = require('./controllers/admin');
    // Admin middleware
    var isAdmin = adminController.isAdmin;

    app.get('/admin', [isAdmin], require('./handlers/admin').dashboard);
};
