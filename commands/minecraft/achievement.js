const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'achievement',
  usage: '[ text ]',
  description: "Make a minecraft achievement!",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const word = args.join(" ");
    if (!word) return message.reply("Please enter some text!");
    const random = Math.floor((Math.random() * 40) + 1);
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Achievement")
          .setImage(encodeURI(`https://minecraftskinstealer.com/achievement/${random}/Achievement/${word}`))
          .setColor("Random")
      ]
    });
  }
}
