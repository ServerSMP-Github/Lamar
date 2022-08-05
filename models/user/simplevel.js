const { Schema, model } = require('mongoose');

module.exports = model('simplevel', new Schema({
    User: String,
    Lowest: Number,
    Highest: Number,
}));
