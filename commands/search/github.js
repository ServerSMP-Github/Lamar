const { Message, Client, EmbedBuilder } = require('discord.js');
const { formatedDate } = require("../../assets/api/time/index");

module.exports = {
  name: "github",
  usage: "[username]",
  description: "Retrieve information about a GitHub user account.",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {

    if (!args[0]) return message.reply("Please give me a username!");

    const getUser = await (await fetch(`https://api.github.com/users/${args.join('-')}`)).json();

    if (getUser.message) return message.reply("User not found | Please give me a valid username!");

    message.reply({
      embeds: [
        new EmbedBuilder()
        .setAuthor({ name: `${getUser.login} Information!`, iconURL: getUser.avatar_url })
        .setColor("Random")
        .setThumbnail(`${getUser.avatar_url}`)
        .addFields([
          { name: "Username", value: `${getUser.login}` },
          { name: "ID", value: `${getUser.id}` },
          { name: "Bio", value: `${getUser.bio || "No Bio"}` },
          { name: "Public Repositories", value: `${getUser.public_repos || "None"}`, inline: true },
          { name: "Followers", value: `${getUser.followers}`, inline: true },
          { name: "Following", value: `${getUser.following}`, inline: true },
          { name: "Location", value: `${getUser.location || "No Location"}` },
          { name: "Account Created", value: formatedDate(getUser.created_at) },
        ])
      ]
    });

  }
}
