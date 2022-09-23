const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'qrcode',
  usage: '[ text ]',
  description: "Turn text into qrcode.",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const text = args.join(" ");
    if (!text) return message.reply("Please enter some text to turn into a QRcode!");

    message.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle("QRcode")
        .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(new RegExp(" ", "g"), "%20")}`)
      ]
    });
  }
}
