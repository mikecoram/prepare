require('dotenv').config();

var express = require('express');
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var models = require('./models');

var routes = require('./routes.js');

var app = express();

app.locals.appTitle = 'Boilerplate';

// Handlebars view engine
app.engine('.hbs', handlebars({
    defaultLayout:'main', 
    extname:'.hbs'
}));
app.set('view engine', '.hbs');

// Serve static files
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Session
app.use(session({
  secret: 'super',
  resave: true,
  saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport, models.User);

// Cookies
app.use(cookieParser('keyboard cat'));

// Initialise flash
var flash = require('express-flash');
app.use(flash());

// Routes
routes(app, passport);

// Error handling
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    res.render('error', {
        status: status,
        message: err.message,
        error: app.get('env') === 'development' ? err : ''
    });
});

// Listen
var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening as http://%s:%s', 'localhost', port);
});