var main = require('./handlers/main');

module.exports = function (app) {
    app.get('/', main.home);
};