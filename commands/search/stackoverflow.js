const axios = require("axios");

module.exports = {
  name: 'stackoverflow',
  usage: '[ query ]',
  description: "Search in Stack Overflow",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.reply("Please provide a query to search for!");

    const result = (await axios.get(encodeURI(`https://api.discube.gq/stackoverflow?query=${query}`))).data;

    const first = result.result_one;

    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
        .setTitle("Result for your Search Query: " + query)
        .setDescription(first.title)
        .addField("Tags", first.tags)
        .addField("Answered?", `${first.answered}`)
        .addField("Views", `${first.views}`)
        .addField("Answers", `${first.answers}`)
        .addField("Score", `${first.score}`)
        .setURL(first.link)
        .setColor("DARK_BLUE")
      ]
    });

  },
};
