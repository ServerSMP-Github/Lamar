const { Schema, model } = require("mongoose")

module.exports = model("poll-cmd", Schema({
    message: String,
    users: Array,
}));