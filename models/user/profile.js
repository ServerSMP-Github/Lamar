const { Schema, model } = require('mongoose');

module.exports = model('user-profile', new Schema({
    User: String,
    Name: String,
    Description: String,
    Status: String,
    Statustype: String,
    Descriminator: String,
    Background: String,
    Level: Number,
    XP: Number,
    MaxXP: Number,
}));