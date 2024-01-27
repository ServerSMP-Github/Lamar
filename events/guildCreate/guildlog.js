const { WebhookClient, EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async(guild) => {
    const owner = await guild.fetchOwner();

    new WebhookClient({ url: client.config.channel.webhooks.guildlogs }).send({
        embeds: [
            new EmbedBuilder()
            .setColor("#39ff14")
            .setTitle('New Server')
            .addFields(
                { name: 'Name', value: guild.name, inline: true },
                { name: 'Guild ID', value: guild.id, inline: true },
                { name: 'Owner', value: owner.user.username, inline: true },
                { name: 'Owner ID', value: owner.user.id, inline: true },
            )
            .setFooter({ text: `Guilds: ${client.guilds.cache.size}` })
            .setThumbnail(guild.iconURL())
        ]
    });
}