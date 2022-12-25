const Schema = require('../../models/logs/modlogs');
const client = require("../../index");

module.exports = async(message) => {
    if (!message.guild) return;

    const data = await Schema.findOne({ Guild: message.guild.id }).exec();
    if (!data) return;

    data.Messages = Number(data.Messages) + 1;
    await data.save();
} 