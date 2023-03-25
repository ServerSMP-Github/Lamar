const { Schema, model } = require('mongoose');

module.exports = model('welcome', new Schema({
    Guild: String,
    Channel: String,
    Type: String,
    Options: Object
}));