const { Message, Client, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

module.exports = {
    name: "delete",
    description : "Give's a image of you getting deleted",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const canvas = createCanvas(748, 356);
        const ctx = canvas.getContext("2d");

        const background = await loadImage("./assets/image/roleplay/delete.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const image = await loadImage(message.author.displayAvatarURL({ dynamic: false, format: 'png' }));
        ctx.drawImage(image, 120, 135, 195, 195);

        return message.channel.send({
            files: [
                new AttachmentBuilder(canvas.toBuffer(), { name: "deleted.png" })
            ]
        });
    },
};