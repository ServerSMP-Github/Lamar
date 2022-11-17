const { Schema, model } = require('mongoose');

module.exports = model('crosspost', new Schema({
    Guild: String,
}));