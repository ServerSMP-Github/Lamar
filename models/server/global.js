const { Schema, model } = require('mongoose');

module.exports = model('global', new Schema({
    Guild: String,
    Channel: String
}));