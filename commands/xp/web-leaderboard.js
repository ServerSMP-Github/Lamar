const { getWebsite } = require("../../assets/api/url");
const xpSchema = require("../../models/server/xp");
const { Message, Client } = require('discord.js');

module.exports = {
  name: 'web-leaderboard',
  description: "Get the leaderboard but on your web browser.",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const xpData = await xpSchema.findOne({ Guild: message.guild.id });
    if (!xpData) return message.reply("XP system is disabled on this server!");

    if (xpData.WebUI === false) return message.reply("Web UI is disabled on this server!");

    return message.reply(`${getWebsite(client)}/api/lb/${message.guild.id}`);
  }
}
