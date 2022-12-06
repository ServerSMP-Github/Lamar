const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "imdb",
  usage: "[ movie name ]",
  description: "Search imdb on discord.",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.reply("Please provide a query to search for!");

    const result = await (await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(query)}`)).json();
    if (result.error) return message.reply("No movie found.");

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setColor("#b39ef3")
        .setThumbnail(result.poster)
        .setURL(result.imdburl)
        .setTitle(result.title)
        .addFields([
          { name: "Ratings", value: result.ratings[0].value, inline: true },
          { name: "Votes", value: result.votes, inline: true },
          { name: "Country", value: result.country, inline: true },
          { name: "Languages", value: result.languages, inline: true },
          { name: "Box Office", value: result.boxoffice, inline: true },
          { name: "Director", value: result.director, inline: true },
          { name: "Run Time", value: result.runtime, inline: true },
          { name: "Type", value: result.type, inline: true },
          { name: "Released", value: new Date(result.released).toDateString(), inline: true }
        ])
        .setDescription(result.plot.slice(0, 4093) + "..")
      ]
    });
  }
}
