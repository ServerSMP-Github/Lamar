const { Schema, model } = require('mongoose');

module.exports = model('welcome-settings', new Schema({
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