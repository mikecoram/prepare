describe('Database', function () {
    it('Connection', function (done) {
        var env = 'test';
        var Sequelize = require('sequelize');
        var config = require(__dirname + '/../config/config.json')[env];
        var sequelize = new Sequelize(config.database, config.username, config.password, config);
        sequelize.authenticate().then(function (res) {
            console.log('Connected to database!');
            done();
        }, function (err) {
            done(err);
        });
    });
});