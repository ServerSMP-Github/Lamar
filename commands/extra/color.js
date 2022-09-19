const { Client, Message, EmbedBuilder } = require('discord.js');
const { isValidHexCode } = require("../../assets/api/color");
const { createCanvas } = require('@napi-rs/canvas');
const { Color } = require("coloras");


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
            if (!isValidHexCode(colorHex)) return message.reply("The color is not a valid color.")
            const selectedColor = new Color(colorHex);

            // Color Image
            const canvas = createCanvas(128, 128);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = selectedColor.toHex();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Message
            message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Color: ${colorHex}`)
                    .setDescription(`Hex: \`${selectedColor.toHex()}\`\nRGB: \`${selectedColor.toRgb()}\`\nHSL: \`${selectedColor.toHsl()}\`\nHSV: \`${selectedColor.toHsv()}\`\nCMYK: \`${selectedColor.toCmyk()}\``)
                    .setImage("attachment://color.png")
                    .setColor(selectedColor.toHex())
                ],
                files: [
                    new AttachmentBuilder(canvas.toBuffer(), { name: "color.png" })
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
                    new EmbedBuilder()
                    .setTitle("Color: RANDOM")
                    .setDescription(`Hex: \`${random.toHex()}\`\nRGB: \`${random.toRgb()}\`\nHSL: \`${random.toHsl()}\`\nHSV: \`${random.toHsv()}\`\nCMYK: \`${random.toCmyk()}\``)
                    .setImage("attachment://color.png")
                    .setColor(random.toHex())
                ],
                files: [
                    new AttachmentBuilder(canvas.toBuffer(), { name: "color.png" })
                ]
            });
        }
    }
}