const { Schema, model } = require("mongoose")

module.exports = model("poll-cmd", Schema({
    messageId: {
        type: String,
        required: true
    },
    users: Array,
}));