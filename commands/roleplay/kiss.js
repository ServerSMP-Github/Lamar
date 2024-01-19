const { Message, Client, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");

module.exports = {
    name: 'kiss',
    usage: '[user]',
    description : "Send a kiss to someone special.",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("You need to mention a user!");

        const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'kiss.webp'));

        const img1 = await loadImage(message.author.displayAvatarURL({ dynamic: false, format: 'png' }));
        const img2 = await loadImage(user.user.displayAvatarURL({ dynamic: false, format: 'png' }));

        const canvas = createCanvas(768, 574);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(base, 0, 0, 768, 574);

        ctx.save();
        ctx.beginPath();
        ctx.arc(150 + 100, 25 + 100, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img1, 150, 25, 200, 200);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(350 + 100, 25 + 100, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img2, 350, 25, 200, 200);
        ctx.restore();

        message.channel.send({
            files: [new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "slap.png" })]
        });
    }
}