const { Message, Client, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { applyText } = require("../../assets/api/canvas");
const path = require("path");

module.exports = {
    name: 'wanted',
    usage: '[@user (or not)]',
    description : "Wanted dead or alive.",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) user = message.member;

        const price = Math.floor(Math.random() * 188708) + 329889;

        const canvas = createCanvas(257, 383);
        const ctx = canvas.getContext("2d");

        const avatar = await loadImage(user.user.displayAvatarURL({ dynamic: false, format: 'png' }));
        const background = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'wanted.png'));

        ctx.drawImage(avatar, 25, 60, 210, 210);
        ctx.drawImage(background, 0, 0, 257, 383);

        ctx.textAlign = "center";
        ctx.font = applyText(canvas, `${price.toLocaleString()}$`, 80, 200, "Times New Roman");
        ctx.fillStyle = "#513d34";
        ctx.fillText(`${price.toLocaleString()}$`, 128, 315);

        message.channel.send({
            files: [new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "wanted.png" })]
        });
    }
}
