const { Schema, model } = require('mongoose');

module.exports = model('ttt-game', new Schema({
    Guild: String,
    User: String,
}));