const crypto = require('crypto');

function generatePassword(passwordLength) {
    return crypto.randomBytes(passwordLength).toString('hex');
}

module.exports = {
    generatePassword
}