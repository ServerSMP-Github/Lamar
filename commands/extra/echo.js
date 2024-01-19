const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "echo",
    usage: "[message]",
    description: "Echo your text in a stylish embed format.",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const description = args.join(" ");
        if (!args.length) return message.reply("Please specify some text to echo!");

        message.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Echo!")
            .setDescription(description)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setColor("Random")
        ]});
    },
};
