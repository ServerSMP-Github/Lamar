const { Schema, model } = require('mongoose');

module.exports = model('reaction-roles', new Schema({
    Guild: String,
    Channel: String,
    Message: String,
    Roles: Array
}));
