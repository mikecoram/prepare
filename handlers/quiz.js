exports.quiz = function (req, res) {
    res.render('quiz', {
        authorised: req.user != undefined
    });
}