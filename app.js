require('dotenv').config();

var express = require('express');
var handlebars = require('express-handlebars');

var routes = require('./routes.js');

var app = express();

app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

var Sequelize = require('sequelize');
var config = require(__dirname + '/config/config.json')['development'];
var s = new Sequelize(config.database, config.username, config.password, config);
s.authenticate().then(function() {
    console.log('Connected to Database!');
});

routes(app);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        status: err.status,
        message: err.message,
        error: app.get('env') === 'development' ? err : ''
    });
});

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening as http://%s:%s', 'localhost', port);
});