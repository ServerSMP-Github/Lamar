const { Schema, model } = require('mongoose');

module.exports = model('music', new Schema({
    Guild: String,
    Skip: Boolean,
    Shuffle: Boolean,
}));
