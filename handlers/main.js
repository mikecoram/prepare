exports.home = function (req, res) {
    res.render('home');
}

exports.dashboard = function (req, res) {
    res.render('dashboard', {
        authorised: req.user != undefined
    });
}