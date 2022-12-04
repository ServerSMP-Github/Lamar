const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
  name: 'are-ya-okay',
  usage: '[ text ]',
  description: "Make an image with text on it, for the meme.",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const say = args.join(" ");
    if (!say) return message.reply("Please enter some text!");

    const canvas = createCanvas(464, 463);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('./assets/image/are-ya-okay.png');
    ctx.drawImage(background, 0, 0, 464, 463);

    ctx.font = '32px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${say}`, 280, 135);
    ctx.textAlign = "center";
W
    message.channel.send({
      files: [
        new AttachmentBuilder(canvas.toBuffer(), { name: 'dad.png' })
      ]
    });
  }
}
