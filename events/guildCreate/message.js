const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const client = require("../../index");

module.exports = async(guild) => {
    let channelToSend;
    guild.channels.cache.forEach((channel) => channel.type === ChannelType.GuildText && !channelToSend && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) ? channelToSend = channel : null);
    if (!channelToSend) return;

    channelToSend.send({
        embeds: [
            new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(`Thank you for inviting ${client.user.username} to your server!\n\`\`\`js\nPrefix: ${client.config.bot.info.prefix}\nHelp: ${client.config.bot.info.prefix}help\`\`\`\n`)
            .addFields([
                { name: "TERMS OF SERVICE", value: "By inviting this bot, you accept that all data in your server and users may be logged." },
                { name: "ALPHA", value: "This bot is in alpha, so expect changes and updates." },
            ])
            .setTimestamp()
        ]
    });
}