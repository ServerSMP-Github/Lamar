const _8ball = require("../../assets/api/serversmp-api/8ball.json");
const { Client, Message, EmbedBuilder } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: "8ball",
    description: "Yep just a 8ball command",
    usage: "[ question ]",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
      const text = args.join(" ");

      if (!text) return message.reply("You need a question.");

      if (text.length > 1000) return message.reply("Question can't be more then 1000 length.");

      const responseText = _8ball[getRandomInt(0, _8ball.length)];

      message.reply({ embeds: [
        new EmbedBuilder()
        .setDescription(`**Question:** *${text}*\n**Answer:** ${responseText.emoji} *${responseText.text}*`)
        .setColor(`${responseText.color}`)
      ]});
    },
};