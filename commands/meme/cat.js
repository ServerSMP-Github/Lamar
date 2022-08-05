const { Client, Message, MessageEmbed } = require("discord.js");
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
                new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Cat")
                    .setImage(cat.data.file)
            ]
        });
    },
};