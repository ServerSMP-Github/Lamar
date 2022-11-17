const { Schema, model } = require('mongoose');

module.exports = model('altDetectionSystem', new Schema({
    Guild: String,
    Type: String,
    Message: Boolean,
}));