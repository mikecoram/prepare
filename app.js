var express = require('express');
var handlebars = require('express-handlebars');

var app = express();

app.engine('handlebars', handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

var server = app.listen(8000, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening as http://%s:%s', host, port);
});