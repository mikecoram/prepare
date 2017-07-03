

//Models
var models = require("../models");

describe('models', function () {
    it('sync', function (done) {
        //Sync Database
        models.sequelize.sync().then(function() {
            done();
        }).catch(function(err) {
            done(err);
        });
    });
}); 
