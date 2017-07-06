require('dotenv').config();

var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var models = require('./models');

var routes = require('./routes.js');

var app = express();

app.locals.appTitle = 'Boilerplate';

app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Initialize passport
app.use(session({
  secret: 'super',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport, models.User);

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
        layout: false,
        status: status,
        message: err.message,
        error: app.get('env') === 'development' ? err : ''
    });
});

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening as http://%s:%s', 'localhost', port);
});