const { goodbyeImage } = require('discord-welcome-card');
const Schema = require('../../models/logs/goodbye');
const client = require("../../index");

module.exports = async(member) => {
    Schema.findOne({ Guild: member.guild.id }, async(err, data) => {
        if(!data) return;

        const channel = member.guild.channels.cache.get(data.Channel);

        channel.send({ files: [await goodbyeImage(message.member, { theme: 'dark' })] });
    });
}