const { EmbedBuilder, Message, Client } = require('discord.js');
const simplydjs = require('simply-djs')

module.exports = {
    name: 'setup-ticket',
    description: "Setup tickets.",
    usage: "[ #channel or current ch ]",
    userPermissions: ["MANAGE_GUILD"],

    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async(client, message, args) => {
      let channel = message.channel;
      if (message.mentions.channels.first()) channel = message.mentions.members.first();

      simplydjs.ticketSystem(message, channel);
  }
}
