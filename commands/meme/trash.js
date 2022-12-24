const { Message, Client, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");

module.exports = {
    name: 'trash',
    usage: '[@user (or not)]',
    description : "Spider man say's you/friend is trash.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) user = message.member;

        const bg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'trash.png'));

        const img = await loadImage(user.user.displayAvatarURL({ dynamic: false, format: 'png' }));

        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(bg, 0, 0, bg.width, bg.height);

        ctx.drawImage(img, 309, 0, 309, 309);

        ctx.filter = 'blur(5px)';

        ctx.drawImage(img, 309, 0, 309, 309);

        message.channel.send({
            files: [new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "trash.png" })]
        });
    },
};