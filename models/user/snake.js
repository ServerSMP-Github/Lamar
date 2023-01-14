const { Schema, model } = require('mongoose');

module.exports = model('snake-game', new Schema({
    Guild: String,
    User: String,
}));