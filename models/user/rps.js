const { Schema, model } = require('mongoose');

module.exports = model('rps-game', new Schema({
    Guild: String,
    User: String,
}));