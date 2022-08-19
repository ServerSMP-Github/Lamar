const { Message, Client, AttachmentBuilder } = require('discord.js');
const canvas = require("discord-canvas")

module.exports = {
  name: 'fortnite-stats',
  usage: '[username]',
  aliases: ['fr-stats'],
  description: "Fortnite user stats.",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!client.config.api.fortnitetracker) return message.reply("This command is disabled");
    const stats = new canvas.FortniteStats();

    const user = args.slice(0).join(' ');
    const platform = "pc";

    const image = await stats
      .setToken(client.config.api.fortnitetracker)
      .setUser(user)
      .setPlatform(platform)
      .toAttachment();

    if (platform !== "pc" && platform !== "xbl" && platform !== "psn") return message.channel.send("Please enter a valid platform")
    if (!image) return message.channel.send("User not found")

    const attachment = new AttachmentBuilder(image.toBuffer(), { name: "FortniteStats.png" });

    message.channel.send({
      files: [attachment]
    });
  }
}
