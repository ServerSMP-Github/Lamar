const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const {
    Color,
    isColor
} = require("coloras");
const {
    createCanvas,
    loadImage
} = require('canvas');


module.exports = {
    name: 'color',
    description: "Get info on colors!",
    usage: "[ hex color or not ]",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const colorHex = args[0];
        if (colorHex) {
            // Color
            const colorCheck = isColor(colorHex);
            if (colorCheck.color === false) return message.reply("The color is not a valid color.");
            if (colorCheck.colorSystem !== "hex") return message.reply("The color is not a valid color.");
            const selectedColor = new Color(colorHex);

            // Color Image
            const canvas = createCanvas(128, 128);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = selectedColor.toHex();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Message
            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`Color: ${colorHex}`)
                    .setDescription(`Hex: \`${selectedColor.toHex()}\`\nRGB: \`${selectedColor.toRgb()}\`\nHSL: \`${selectedColor.toHsl()}\`\nHSV: \`${selectedColor.toHsv()}\`\nCMYK: \`${selectedColor.toCmyk()}\``)
                    .setImage("attachment://color.png")
                    .setColor(selectedColor.toHex())
                ],
                files: [
                    new MessageAttachment(canvas.toBuffer(), "color.png")
                ]
            });
        } else {
            // Color
            const random = new Color();

            // Color Image
            const canvas = createCanvas(128, 128);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = random.toHex();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Message
            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle("Color: RANDOM")
                    .setDescription(`Hex: \`${random.toHex()}\`\nRGB: \`${random.toRgb()}\`\nHSL: \`${random.toHsl()}\`\nHSV: \`${random.toHsv()}\`\nCMYK: \`${random.toCmyk()}\``)
                    .setImage("attachment://color.png")
                    .setColor(random.toHex())
                ],
                files: [
                    new MessageAttachment(canvas.toBuffer(), "color.png")
                ]
            });
        }
    }
}