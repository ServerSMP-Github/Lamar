const { Client, Message, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: "duck",
    description: "A random image of a duck.",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("Random duck")
                .setImage("attachment://duck.webp")
            ],
            files: [
                new AttachmentBuilder(`./assets/api/duck/${getRandomInt(1, 244)}.webp`, { name: "duck.webp" })
            ]
        });
    },
};