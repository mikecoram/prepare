function validateForm () {
    var error = '';

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