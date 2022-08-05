const { Client, Message, MessageEmbed } = require("discord.js");
const fetch = require("axios");

module.exports = {
    name: "duck",
    description: "A random image of a duck.",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const duck = await fetch("https://random-d.uk/api/v2/random");
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Random duck")
                    .setDescription("A random duck from `https://random-d.uk/`.")
                    .setImage(String(duck.data.url))
            ]
        });
    },
};