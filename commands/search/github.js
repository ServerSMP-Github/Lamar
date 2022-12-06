const { Message, Client, EmbedBuilder } = require('discord.js');
const { formatedDate } = require("../../assets/api/time/index");

module.exports = {
  name: "github",
  description: "Github User Account Information!",
  usage: "[ github username ]",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {

    try {
      if (!args[0]) return message.reply("Please give me a username!");

      const {
        id,
        bio,
        login,
        message,
        location,
        followers,
        following,
        avatar_url,
        created_at,
        public_repos,
      } = await (await fetch(`https://api.github.com/users/${args.join('-')}`)).json();

      if (message) return message.reply("User not found | Please give me a valid username!");

      message.reply({
        embeds: [
          new EmbedBuilder()
          .setAuthor({ name: `${login} Information!`, iconURL: avatar_url })
          .setColor("Random")
          .setThumbnail(`${avatar_url}`)
          .addFields([
            { name: "Username", value: `${login}` },
            { name: "ID", value: `${id}` },
            { name: "Bio", value: `${bio || "No Bio"}` },
            { name: "Public Repositories", value: `${public_repos || "None"}`, inline: true },
            { name: "Followers", value: `${followers}`, inline: true },
            { name: "Following", value: `${following}`, inline: true },
            { name: "Location", value: `${location || "No Location"}` },
            { name: "Account Created", value: formatedDate(created_at) },
          ])
        ]
      });
    } catch (error) {
      return message.reply("Something went wrong try again later!");
    }

  }
}
