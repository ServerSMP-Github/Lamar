const { getRandom } = require("../crypto");

function chunkArray(array, chunkSize) {
    const chunks = [];

    for (let i = 0; i < array.length; i += chunkSize) chunks.push(array.slice(i, i + chunkSize));

    return chunks;
}

function getRandomElement(array) {
    if (array.length === 0) return undefined;

    const randomIndex = Math.floor(getRandom() * array.length);

    return array[randomIndex];
}

module.exports = {
    getRandomElement,
    chunkArray
};