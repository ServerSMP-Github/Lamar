const { Message, Client, EmbedBuilder } = require("discord.js");
const jokes = require("../../assets/api/serversmp-api/joke.json");

module.exports = {
    name: "joke",
    description: "Get's a random joke.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const randomNumber = Math.floor(Math.random() * jokes.length);
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setDescription(jokes[randomNumber])
            ]
        });
    },
};