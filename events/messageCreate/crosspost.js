const postSchema = require('../../models/server/crosspost.js');
const { ChannelType } = require("discord.js")
const client = require("../../index");

module.exports = async(message) => {
    if (!message.guild) return;

    const postData = await postSchema.findOne({ Guild: message.guild.id });

    if (!postData) return;

    if (message.channel.type === ChannelType.GuildAnnouncement) message.crosspost();
}