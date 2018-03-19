exports.populateLocals = populateLocals;

function populateLocals(app) {
    addLocal(app, 'AppTitle', 'Prepare');
}

function addLocal (app, key, value) {
    app.locals[key] = value;
}