const { Client, Message, EmbedBuilder } = require("discord.js");

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
        const image = (await (await fetch("https://random-d.uk/api/v2/random")).json()).url;

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("Random duck")
                .setDescription("A random duck from `https://random-d.uk/`.")
                .setImage(image)
            ]
        });
    },
};