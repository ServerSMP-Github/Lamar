const { Client, Message, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: "cat",
    description: "Display a random image of a cat.",

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
                .setTitle("Cat")
                .setImage("attachment://cat.webp")
            ],
            files: [
                new AttachmentBuilder(`./assets/api/cat/${getRandomInt(1, 1000)}.webp`, { name: "cat.webp" })
            ]
        });
    },
};