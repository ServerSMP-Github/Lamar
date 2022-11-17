const client = require('../index');
const { goodbyeImage } = require('discord-welcome-card');
const Schema = require('../models/logs/goodbye');

client.on('guildMemberRemove', async(member) => {
    Schema.findOne({ Guild: member.guild.id }, async(e, data) => {
        if(!data) return;
        const channel = member.guild.channels.cache.get(data.Channel);

        channel.send({ files: [await goodbyeImage(message.member, { theme: 'dark' })] });
    });
});
