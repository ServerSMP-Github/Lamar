const {
  MessageEmbed,
  Message,
  Client
} = require('discord.js');

module.exports = {
  name: 'set-status',
  usage: '[ new status ]',
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
      .replace(/{guildsCount}/g, await client.guilds.cache.size)
      .replace(/{usersCount}/g, await client.users.cache.size)
      .replace(/{channelsCount}/g, await client.channels.cache.size)
      .replace(/{commandCount}/g, cmdCount)
      .replace(/{botVersion}/g, verFile.version)
      .replace(/{botName}/g, await client.user.username)
      .replace(/{botPrefix}/g, process.env.PREFIX);
    client.user.setActivity(botStatus);

  }
}
