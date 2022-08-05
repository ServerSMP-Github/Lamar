const { Schema, model } = require('mongoose');

module.exports = model('xp-settings', new Schema({
    Guild: String,
    Channel: String,
    Ping: Boolean,
    WebUI: Boolean,
    Rate: Number,
}));