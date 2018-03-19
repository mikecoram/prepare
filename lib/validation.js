exports.isValidEmailAddress = isValidEmailAddress;
exports.isValidPassword = isValidPassword;

function isValidEmailAddress (emailAddress) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegex.test(emailAddress);
}

function isValidPassword(password) {
    var passwordRegex = /^.{6,}$/;

    return passwordRegex.test(password);
}