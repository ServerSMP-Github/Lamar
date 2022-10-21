const { Message, Client, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "archive",
    description: "Archive a Channel",
    userPermission: [PermissionsBitField.Flags.ManageChannels],
    botPermission: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ManageChannels],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        message.channel.permissionOverwrites.edit(message.guild.id, { VIEW_CHANNEL: false });

        await message.channel.send({ 
            embeds: [
                new EmbedBuilder()
                .setTitle("Channel Updates")
                .setDescription(`🔒 ${message.channel} has been Archived!`)
                .setColor("Blurple")
            ]
        });

        message.delete();
    }
}