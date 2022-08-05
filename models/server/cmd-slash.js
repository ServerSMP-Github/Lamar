const { Schema, model } = require('mongoose');

module.exports = model('cmds-slash', new Schema({
    Guild: String,
    Cmds: Array
}));