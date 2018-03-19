exports.generatePasswordHash = generatePasswordHash;
exports.passwordMatchesHash = passwordMatchesHash

const bCrypt = require('bcrypt-nodejs');

function generatePasswordHash (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

function passwordMatchesHash (password, hash) {
    return bCrypt.compareSync(password, hash);
}
