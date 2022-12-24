const { Message, Client, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { wrapText } = require("../../assets/api/canvas");
const path = require("path");

module.exports = {
    name: 'lisapresentation',
    aliases : ['lp'],
    description : "Lisa presentaition meme template.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const text = args.slice(0).join(" ");
        if (!text || text.length > 300) return message.reply("You must provide a text of 300 characters or less.");

        const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'lisapresentation.png'));

        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(base, 0, 0);
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "40px Noto";

        let fontSize = 40;
        while (ctx.measureText(text).width > 1320) {
            fontSize -= 1;
            ctx.font = `${fontSize}px Noto`;
        }

        const lines = wrapText(ctx, text, 330);
        const topMost = 185 - (((fontSize * lines.length) / 2) + ((20 * (lines.length - 1)) / 2));
        for (let i = 0; i < lines.length; i++) {
            const height = topMost + ((fontSize + 20) * i);
            ctx.fillText(lines[i], base.width / 2, height);
        }

        message.channel.send({
            files: [new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "LisaPresentation.png" })]
        });
    },
};