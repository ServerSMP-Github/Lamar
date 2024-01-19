const { Message, Client } = require('discord.js');
const { afk } = require('../../client/collection');

module.exports = {
  name: 'afk',
  usage: '[reason]',
  description : "Set an AFK message for mentions and automatically clear it when you return.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
      const reason = args.join(" ") || 'No Reason!';

      afk.set(message.author.id, [
        Date.now(),
        reason
      ]);

      message.reply(`You are now afk \`${reason}\``)
  },
};
