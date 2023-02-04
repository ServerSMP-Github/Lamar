const { blacklistedwords } = require('../../client/collection');
const Schema = require('../../models/moderator/blackwords');

module.exports = async (client) => {
    Schema.find()
        .then((data) => {
            data.forEach((val) => {
                blacklistedwords.set(val.Guild, val.Words);
            });
        });
}