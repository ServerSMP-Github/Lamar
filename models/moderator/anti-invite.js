const { Schema, model } = require('mongoose');

module.exports = model('anti-invite', new Schema({
    Guild: String,
    Message: Boolean,
}));