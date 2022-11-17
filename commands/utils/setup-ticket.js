const {  Message, Client, PermissionsBitField } = require('discord.js');
const simplydjs = require('simply-djs')

module.exports = {
    name: 'setup-ticket',
    description: "Setup tickets.",
    usage: "[ #channel or current ch ]",
    userPermission: [PermissionsBitField.Flags.ManageGuild],

    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async(client, message, args) => {
      const channel = message.mentions.channels.first() ? message.mentions.channels.first() : message.channel;

      simplydjs.ticketSystem(message, channel);
  }
}
