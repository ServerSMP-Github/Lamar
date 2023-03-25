const { Schema, model } = require('mongoose');

module.exports = model('goodbye', new Schema({
    Guild: String,
    Channel: String,
    Type: String,
    Options: Object
}));