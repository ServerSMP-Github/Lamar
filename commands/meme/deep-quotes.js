const quotes = require("../../assets/api/quotes/index.json");
const { Message, Client } = require("discord.js");

module.exports = {
    name: "deep-quotes",
    aliases : ['dq'],
    description : "A kinda random deep quote.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const index = Math.floor(Math.random() * (quotes.length));

        message.channel.send(quotes[index]);
    },
};