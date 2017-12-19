exports.quiz = function (req, res) {
    res.render('quiz/quiz', {
        authorised: req.user != undefined
    });
}