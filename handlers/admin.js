exports.dashboard = function (req, res) {
    var User = require(__base + '/models').User;

    User.findAll({
        attributes: ['emailAddress', 'status', 'createdAt', 'updatedAt']
    }).then(function (users) {
        res.render('admin/home', {
            layout: 'admin',
            users: users
        });    
    });
}