const { Client, Message, EmbedBuilder } = require("discord.js");
const fetch = require("axios");

module.exports = {
    name: "cat",
    description: "A random image of a cat.",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const cat = await fetch("https://aws.random.cat/meow");
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Cat")
                    .setImage(cat.data.file)
            ]
        });
    },
};