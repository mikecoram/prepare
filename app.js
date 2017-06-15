var express = require('express');
var handlebars = require('express-handlebars');

var routes = require('./routes.js');

var app = express();

app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

routes(app);

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening as http://%s:%s', host, port);
});