const { Schema, model } = require('mongoose');

module.exports = model('poll-channels', new Schema({
    Guild: String,
    Channels: Array
}));