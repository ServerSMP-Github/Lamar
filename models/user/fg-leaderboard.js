const { Schema, model } = require('mongoose');

module.exports = model('fg-lb', new Schema({
    id: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
        default: 0,
    }
}));