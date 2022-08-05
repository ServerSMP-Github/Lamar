const { Client, Message, MessageEmbed } = require("discord.js");
const _8ball = require("../../assets/api/serversmp-api/8ball.json");

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
      if(!text) return message.reply("You need a question.");
      if(text.length > 1000) return message.reply("Question can't be more then 1000 length.")
      const randomNumber = Math.floor(Math.random() * _8ball.length);
      const responseText = _8ball[randomNumber];
      message.reply({ embeds: [
        new MessageEmbed()
          .setDescription(`**Question:** *${text}*\n**Answer:** ${responseText.emoji} *${responseText.text}*`)
          .setColor(`${responseText.color}`)
      ]})
    },
};