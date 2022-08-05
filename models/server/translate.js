const { Schema, model } = require('mongoose');

module.exports = model('translate', new Schema({
    Guild: String,
    Language: String,
    Percent: Number
}));