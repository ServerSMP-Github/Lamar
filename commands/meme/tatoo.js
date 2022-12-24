const { Message, Client, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");

module.exports = {
    name: 'tatoo',
    usage: '[ @user? ]',
    description : "You/friend are the best tatoo.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) user = message.member;

        const canvas = createCanvas(750, 1089);
        const ctx = canvas.getContext("2d");

        const avatar = await loadImage(user.user.displayAvatarURL({ dynamic: false, format: 'png' }));
        ctx.drawImage(avatar, 145, 575, 400, 400);

        const background = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'tatoo.png'));
        ctx.drawImage(background, 0, 0, 750, 1089);

        message.channel.send({
            files: [new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "tatoo.png" })]
        });
    },
};