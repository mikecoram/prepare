var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var passwordRegex = /^.{6,}$/;

function validateForm () {
    var error = '';

    if (!emailRegex.test($('#emailAddress').val())) {
        error += 'Please enter a valid email address.\n';
    }

    if (!passwordRegex.test($('#password').val())) {
        error += 'Your password must be at least 6 characters long.\n'
    }

    if ($('#password').val() != $('#confirmPassword').val()) {
        error += 'Your passwords do not match.\n';
    }

    if (error.length > 0) {
        $('#localError').text(error);
        $('#localError').attr('hidden', false);
        return false;    
    }

    return true;
}