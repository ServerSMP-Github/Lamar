const { Schema } = require("mongoose");
const client = require("../../index");

module.exports = client.apiConnection.model('botStats', new Schema({
    Account: String,
    Guilds: Number,
    Channels: Number,
    Users: Number,
    Commands: Number,
    CmdUsed: Number,
}));