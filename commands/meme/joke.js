const jokes = require("../../assets/api/serversmp-api/joke.json");
const { Message, Client, EmbedBuilder } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: "joke",
    description: "Receive a random joke for a good laugh.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const randomNumber = getRandomInt(0, jokes.length);

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setDescription(jokes[randomNumber])
            ]
        });
    },
};