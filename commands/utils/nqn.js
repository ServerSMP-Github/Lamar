const { Message, Client } = require("discord.js");
const Nqn = require("../../models/server/nqn");

module.exports = {
    name: "nqn",
    usage: "[add | remove]",
    description : "Add or remove yourself from NQN.",
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async(client, message, args) => {
      const query = args[0]?.toLowerCase();
      if (!query || !["add", "remove"].includes(query)) return message.reply("Only `add` or `remove` are the query.");

      const nqnData = await Nqn.findOne({ Guild: message.guild.id });
      if (!nqnData) return message.reply("This server does not have NQN.");

      query == "add" ? nqnData.Users.push(message.author.id) : nqnData.Users.pull(message.author.id);
      await nqnData.save();

      message.reply(`${query == "add" ? "Added" : "Removed"} ${message.author.username} to the NQN whitelist.`);
    }
}
