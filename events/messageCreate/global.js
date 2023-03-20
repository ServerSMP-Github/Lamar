const globalSchema = require('../../models/server/global');
const { EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async(message) => {
    if(message.author.bot || !message.guild) return;

    const guildData = await globalSchema.findOne({ Channel: message.channel.id, Activated: true });

    if (!guildData) return;

    const globalData = await globalSchema.find({ Activated: true });

    globalData.map(({ Channel }) => {
        if (Channel === message.channel.id) return;

        client.channels.cache.get(Channel).send({ embeds: [
            new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(message.content)
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor("Random")
                .setTimestamp()
        ]});
    });
}