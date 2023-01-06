const crypto = require('crypto');

function generatePassword(passwordLength) {
    return crypto.randomBytes(passwordLength).toString('hex');
}

function generateRandomNumber(max) {
    return parseInt(crypto.randomBytes(4).toString('hex'), 16) % max;
}

function getRandomInt(min, max) {
    const buf = crypto.randomBytes(4);

    const num = buf.readUInt32BE();

    return Math.floor(num / 4294967295 * (max - min + 1) + min);
}

function getRandom() {
    const buf = crypto.randomBytes(4);

    const num = buf.readUInt32BE();

    return num / 4294967295;
}

module.exports = {
    generateRandomNumber,
    generatePassword,
    getRandomInt,
    getRandom
}