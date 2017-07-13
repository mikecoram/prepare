function processResult (error, result) {
    if (result != true) {
        error += result + '\n';
    }
}

function validateForm () {
    var error = '';
    var result;

    result = validation.isValidEmailAddress($('#emailAddress').val());
    processResult(error, result);
    result = validation.isValidPassword($('#password').val());
    processResult(error, result);
    result = validationn.passwordsMatch($('#password').val(), $('#confirmPassword').val());
    processResult(error, result);

    if (error.length > 0) {
        $('#localError').text(error);
        $('#localError').attr('hidden', false);
        return false;    
    }
    return true;
}