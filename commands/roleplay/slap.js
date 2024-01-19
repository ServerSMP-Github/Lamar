const { Message, Client, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");

module.exports = {
    name: 'slap',
    usage: '[user]',
    description : "Give someone a virtual slap.",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("You need to mention a user!");

        const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'slap.webp'));

        const img1 = await loadImage(message.author.displayAvatarURL({ dynamic: false, format: 'png' }));
        const img2 = await loadImage(user.user.displayAvatarURL({ dynamic: false, format: 'png' }));

        const canvas = createCanvas(1000, 500);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(base, 0, 0, 1000, 500);

        ctx.save();
        ctx.beginPath();
        ctx.arc(350 + 110, 70 + 110, 110, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img1, 350, 70, 220, 220);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(580 + 100, 260 + 100, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img2, 580, 260, 200, 200);
        ctx.restore();

        message.channel.send({
            files: [
                new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "slap.png" })
            ]
        });
    }
}