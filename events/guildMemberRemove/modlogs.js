const Schema = require('../../models/logs/modlogs');
const { EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async(member) => {
    const data = await Schema.findOne({ Guild: member.guild.id }).exec();
    if (!data) return;
    if (data.gmr === true) return;
    client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle(":cry: Member Left :cry: ")
            .setColor("Red")
            .setDescription(`**Member:** ${member.user} (\`${member.user.id}\`)\n\`${member.user.username}\``)
            .setFooter({ text: "Noooooooooooo, a member left" })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        ]
    });
}