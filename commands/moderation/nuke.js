const { PermissionsBitField, Message, Client } = require('discord.js');

module.exports = {
    name: "nuke",
    aliases: ["nukechannel", "channelnuke", "channelclear", "clearchannel"],
    description: "Clone a channel and delete the old one.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
      message.channel.clone({ position: message.channel.rawPosition }).then(channel => {
        channel.send({ content: "Channel has been nuked." });

        message.channel.delete().catch (e => channel.send({ content: "An error occured while trying to delete the channel." }));
      });
    }
}
