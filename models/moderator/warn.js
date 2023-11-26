const { Schema, model } = require('mongoose');

module.exports = model('warns', new Schema({
    guildid: String,
    user: String,
    content: Array
}));