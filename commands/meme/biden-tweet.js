const { Message, Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

module.exports = {
    name: "biden-tweet",
    usage: '[text]',
    aliases: ['bt'],
    description: "Yep, you are sending a biden tweet.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const sentence = args.join(" ");
        if (!sentence) return message.channel.send('Please specify a query.');

        const canvas = createCanvas(900, 497);
        const ctx = canvas.getContext('2d');

        const background = await loadImage('./assets/image/roleplay/biden.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = '30px Arial'
        ctx.rotate(0);
        ctx.fillStyle = "#000000";
        ctx.textAlign = "left";
        ctx.fillText(sentence, 22, 130);

        message.channel.send({
          files: [
            new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'biden.png' })
          ],
          embeds: [
            new EmbedBuilder()
            .setTitle("Joe Biden")
            .setColor("Orange")
            .setImage("attachment://biden.png")
          ]
        });
    },
};