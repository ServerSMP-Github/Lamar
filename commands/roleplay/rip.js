const { Message, Client, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const path = require("path");

module.exports = {
    name: 'rip',
    usage: '[user?]',
    description : "Press 'F' to pay respect in memory of someone.",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) user = message.member;

        const canvas = createCanvas(720, 405);
        const ctx = canvas.getContext("2d");

        const background = await loadImage(path.join(__dirname, '..', '..', 'assets', 'image', 'roleplay', 'rip.webp'));
        const avatar = await loadImage(user.user.displayAvatarURL({ dynamic: false, format: 'png' }));

        ctx.drawImage(avatar, 110, 47, 85, 85);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        message.channel.send({
            files: [new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "delete.png" })]
        });
    }
}