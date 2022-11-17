const { Schema, model } = require('mongoose');

module.exports = model('nsfw', new Schema({
    Guild: String,
    Channels: Array,
}));