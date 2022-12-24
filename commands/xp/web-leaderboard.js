const { fetchLeaderboard, computeLeaderboard } = require("../../assets/api/xp");
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

    let lb = await fetchLeaderboard(message.guild.id);
    if (lb.length < 1) return reply("Nobody's in leaderboard yet.");

    lb = await computeLeaderboard(client, lb, true);
    lb = lb.map(e => `{"username":"${e.username}","discriminator":"${e.discriminator}","level":"${e.level}","xp":"${e.xp.toLocaleString()}"}`);

    return message.reply(encodeURI(`${client.config.api.serversmp}bot/leaderboard?users=[${lb.join(',')}]&name=${message.guild.name}&icon=${message.guild.iconURL()}`));
  }
}
