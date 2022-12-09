const { Message, Client } = require('discord.js');
const Levels = require('discord-xp');
const xpSchema = require("../../models/server/xp");

module.exports = {
  name: 'web-leaderboard',
  description: "Get the leaderboard but on your web browser.",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    xpSchema.findOne({ Guild: message.guild.id }, async(err, data) => {
      if (err) console.error(err);
      if (!data) return message.reply("XP system is disabled on this server!");
      if (data.WebUI === false) return message.reply("Web UI is disabled on this server!");

      const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
      if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
      const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
      const lb = leaderboard.map(e => `{"username":"${e.username}","discriminator":"${e.discriminator}","level":"${e.level}","xp":"${e.xp.toLocaleString()}"}`);
      return message.reply(encodeURI(`${client.config.api.serversmp}bot/leaderboard?users=[${lb.join(',')}]&name=${message.guild.name}&icon=${message.guild.iconURL()}`));
    });
  }
}
