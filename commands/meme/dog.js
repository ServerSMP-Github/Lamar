const { Client, Message, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: "dog",
    description: "Display a random image of a dog.",

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
                .setTitle("Dog :dog:")
                .setImage("attachment://dog.webp")
            ],
            files: [
                new AttachmentBuilder(`./assets/api/dog/${getRandomInt(1, 797)}.webp`, { name: "dog.webp" })
            ]
        });
    },
};