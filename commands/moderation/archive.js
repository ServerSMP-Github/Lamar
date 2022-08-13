const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "archive",
    description: "Archive a Channel",
    userPermission: ["MANAGE_CHANNELS"],
    botPermission: ["EMBED_LINKS", "MANAGE_CHANNELS"],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        // lock channel
        message.channel.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: false
        });

        // create embed
        await message.channel.send({ embeds: [
            new EmbedBuilder()
            .setTitle("Channel Updates")
            .setDescription(`🔒 ${message.channel} has been Archived!`)
            .setColor("BLURPLE")
        ]});

        // delete message
        message.delete();
    }
}