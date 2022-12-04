const { isValidHexCode, randomHexColor, hexToRGB, rgbToHsl, rgbToHsv, rgbToCmyk } = require("../../assets/api/color");
const { Client, Message, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('@napi-rs/canvas');

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

        const color = colorHex ? isValidHexCode(colorHex) ? colorHex : null : randomHexColor();

        if (color === null) return message.reply("The color is not a valid color.");

        const canvas = createCanvas(128, 128);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const rgb = hexToRGB(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Color: ${color}`)
                .setDescription(`Hex: \`${color}\`\nRGB: \`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\`\nHSL: \`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\`\nHSV: \`hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)\`\nCMYK: \`cmyk(${Math.round(cmyk.c, 10)}, ${Math.round(cmyk.m, 10)}, ${Math.round(cmyk.y, 10)}, ${Math.round(cmyk.k, 10)})\``)
                .setImage("attachment://color.png")
                .setColor(color)
            ],
            files: [
                new AttachmentBuilder(canvas.toBuffer('image/png'), { name: "color.png" })
            ]
        });
    }
}