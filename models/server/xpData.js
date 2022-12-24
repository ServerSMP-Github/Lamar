const { Schema, model } = require('mongoose');

module.exports = model('Levels', new Schema({
    userID: String,
    guildID: String,
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: new Date()
    },
}));