const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'set-avatar',
  usage: '[image]',
  aliases: ['set-avatar-bot'],
  description: "Set the avatar for the bot.",
  owner: true,

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    if (!client.config.command.owner["set-avatar"]) return message.reply("This command is disabled!");

    const url = args.join(" ");
    if (!url) return message.channel.send("Specify a avatar url.");

    client.user.setAvatar(url);

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle('New Avatar Set')
        .setImage(url)
        .setTimestamp()
      ]
    });
  }
}
