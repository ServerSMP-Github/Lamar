const Schema = require('../../models/logs/modlogs');
const { EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async(member) => {
    const data = await Schema.findOne({ Guild: member.guild.id }).exec();
    if (!data) return;
    if (data.gma === true) return;
    client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle(":new: Member Joined :new: ")
            .setColor("Green")
            .setDescription(`**Member:** ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``)
            .setFooter({ text: "new member op" })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        ]
    });
}