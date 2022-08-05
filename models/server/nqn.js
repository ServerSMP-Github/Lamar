const { Schema, model } = require('mongoose');

module.exports = model('nqn', new Schema({
    Guild: String,
    Users: Array,
}));
