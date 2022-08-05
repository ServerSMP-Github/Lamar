const { EmbedBuilder, Message, Client } = require('discord.js');
const { afk } = require('../../client/collection');

module.exports = {
  name: 'afk',
  usage: '[reason]',
  description : "Make a afk message, so when a player mention you it will say you are afk and when you type a message your afk is done.",
  aliases: ['011000010110011001101011'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
      const reason = args.join(" ") || 'No Reason!';
      afk.set(message.author.id, [ Date.now(), reason ]);
      message.reply(`You are now afk \`${reason}\``)
  },
};
