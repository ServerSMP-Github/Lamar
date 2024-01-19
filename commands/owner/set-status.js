const { Message, Client } = require('discord.js');

module.exports = {
  name: 'set-status',
  usage: '[status]',
  description: "Set the status of the bot.",
  owner: true,

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    if (!client.config.command.owner["set-status"]) return message.reply("This command is disabled!");

    const botStatus = args.join(" ")
      .replace(/{guildsCount}/g, client.guilds.cache.size)
      .replace(/{usersCount}/g, client.users.cache.size)
      .replace(/{channelsCount}/g, client.channels.cache.size)
      .replace(/{commandCount}/g, cmdCount)
      .replace(/{botVersion}/g, client.config.bot.info.version)
      .replace(/{botName}/g, client.user.username)
      .replace(/{botPrefix}/g, client.config.bot.info.prefix);

    client.user.setActivity(botStatus);

    message.channel.send("Updated bot status.");
  }
}
