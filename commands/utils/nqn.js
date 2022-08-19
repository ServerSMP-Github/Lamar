const { Message, Client } = require('discord.js');
const Nqn = require("../../models/server/nqn");

module.exports = {
    name: 'nqn',
    usage: '[ add or remove ]',
    description : "Add or remove yourself from nqn!",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
      if(!args[0]) return message.reply("Only `add` or `remove` are the query.");
      const query = args[0].toLowerCase();
      if(query === "add") {
        Nqn.findOne({ Guild: message.guild.id }, async(err, data) => {
          if(data) {
            data.Users.push(message.author.id);
            data.save();
            return message.reply(`Added ${message.author.username} to the NQN whitelist.`);
          } else return message.reply("This server does not have NQN.");
        });
      } else if(query === "remove") {
        Nqn.findOne({ Guild: message.guild.id }, async(err, data) => {
          if(data) {
            data.Users.pull(message.author.id);
            data.save();
            return message.reply(`Removed ${message.author.username} to the NQN whitelist.`);
          } else return message.reply("This server does not have NQN.");
        });
      } else return message.reply("Only `add` or `remove` are the query.");
    }
}
