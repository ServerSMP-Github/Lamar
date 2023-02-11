const { EmbedBuilder, Message, Client } = require('discord.js');
const userStats = require("../../models/user/user-stats");

module.exports = {
  name: 'cmd-stats',
  description: "Global stats for cmds.",
  owner: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const cmdStats = [];
  
    const stats = await userStats.find().sort({ "CmdUsed": -1 });

    for (let index = 0; index < stats.length; index++) {
      const element = stats[index];

      const userParsed = await client.users.fetch(element.User);
      cmdStats.push(`**${index + 1}**. - *${userParsed.username}#${userParsed.discriminator}*\nCMDs: \`${element.CmdUsed}\``);
    }

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle("CMD stats")
        .setDescription(`${cmdStats.splice(0, 10).join("\n\n")}`)
        .setColor("Random")
      ]
    });
  }
}