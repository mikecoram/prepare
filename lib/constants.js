function addLocal (app, key, value) {
    app.locals[key] = value;
}

// Store constants that can be accessed by the view engine (eg. app name)
exports.populateLocals = function (app) {
    addLocal(app, 'AppTitle', 'Boilerplate');
}

exports.FROM_EMAIL = 'boilerplate@app.com';