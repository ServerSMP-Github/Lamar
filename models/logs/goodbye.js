const { Schema, model } = require('mongoose');

module.exports = model('goodbye-channel', new Schema({
    Guild: String,
    Channel: String,
    Type: String,
    Theme: String,
    Title: String,
    Blur: Boolean,
    Rounded: Boolean,
    Border: Boolean,
    Background: String,
    Color: String,
    FontPath: String,
    FontName: String,
}));