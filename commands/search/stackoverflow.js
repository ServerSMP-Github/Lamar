const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: "stackoverflow",
  usage: "[ query ]",
  description: "Search in Stack Overflow",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.reply("Please provide a query to search for!");

    const result = await (await fetch(encodeURI(`https://api.discube.gq/stackoverflow?query=${query}`))).json();

    const { title, tags, answered, views, answers, score, link } = result.result_one;

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle("Result for your Search Query: " + query)
        .setDescription(title)
        .addField("Tags", tags)
        .addField("Answered?", `${answered}`)
        .addField("Views", `${views}`)
        .addField("Answers", `${answers}`)
        .addField("Score", `${score}`)
        .setURL(link)
        .setColor("DarkBlue")
      ]
    });

  },
};
