const modlogSchema = require("../../models/logs/modlogs");
const { EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async(channel) => {
    const modlogData = await modlogSchema.findOne({ Guild: channel.guild.id });

    if (modlogData && modlogData.Channel === channel.id) await modlogData.deleteOne();
    else {
        if (!modlogData || modlogData.gma === true) return;

        client.channels.cache.get(modlogData.Channel).send({
            embeds: [
                new EmbedBuilder()
                .setTitle(":x: Channel Deleted :x:")
                .setColor("Red")
                .setDescription(`**Channel Name:** \`${channel.name}\`\n**Channel ID:** \`${channel.id}\`\n**Channel Type:** \`${channel.type}\``)
                .setTimestamp()
                .setFooter({ text: "You cant hide anything from us :)" })
            ]
        });
    }
}