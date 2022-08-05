const { Schema, model } = require('mongoose');

module.exports = model('auto-reddit', new Schema({
    Guild: String,
    Channel: String,
    Reddit: String,
}));
