const { Message, Client, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

module.exports = {
    name: "delete",
    description : "Receive an image depicting your deletion.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const canvas = createCanvas(748, 356);
        const ctx = canvas.getContext("2d");

        const background = await loadImage("./assets/image/roleplay/delete.webp");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const image = await loadImage(message.author.displayAvatarURL({ dynamic: false, format: 'png' }));
        ctx.drawImage(image, 120, 135, 195, 195);

        return message.channel.send({
            files: [
                new AttachmentBuilder(canvas.toBuffer('image/png'), { name: "deleted.png" })
            ]
        });
    },
};