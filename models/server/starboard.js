const { Schema, model } = require('mongoose');

module.exports = model('starboard', new Schema({
    Guild: String,
    Channel: String,
}));