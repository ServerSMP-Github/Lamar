const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
    name: "nuke",
    aliases: ["nukechannel", "channelnuke", "channelclear", "clearchannel"],
    cooldown: 1000 * 120,
    description: "This command deletes all messages in the channel it was ran in.",
    userPermission: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
      message.channel.clone({ position: message.channel.rawPosition }).then(channel => {
        channel.send({ content: "Channel has been nuked." })
        message.channel.delete()
        .catch (e => {
          return message.followUp({content: 'An error occured while trying to delete the channel.'})
        });
      });
    }
}
