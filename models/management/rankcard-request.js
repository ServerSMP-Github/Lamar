const { Schema, model } = require('mongoose');

module.exports = model('rankcard-request', new Schema({
    Message: String,
    User: String,
    Background: String,
}));
