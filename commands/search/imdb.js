const { Message, Client, EmbedBuilder } = require("discord.js");
const fetch = require("axios");

module.exports = {
  name: 'imdb',
  usage: '[ movie name ]',
  description: "Search imdb on discord.",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.reply("Please provide a query to search for!");
    const result = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(query)}`).then(res => res.data);
    if (result.error) return message.reply("No movie found.");
    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setColor("#b39ef3")
        .setThumbnail(result.poster)
        .setURL(result.imdburl)
        .setTitle(result.title)
        .addField("Ratings", result.ratings[0].value, true)
        .addField("Votes", result.votes, true)
        .addField("Country", result.country, true)
        .addField("Languages", result.languages, true)
        .addField("Box Office", result.boxoffice, true)
        .addField("Director", result.director, true)
        .addField("Run Time", result.runtime, true)
        .addField("Type", result.type, true)
        .addField("Released", new Date(result.released).toDateString(), true)
        .setDescription(result.plot.slice(0, 4093) + "..")
      ]
    });
  }
}
