const { Schema, model } = require('mongoose');

module.exports = model('fg-instance', new Schema({
    country: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    }
}));