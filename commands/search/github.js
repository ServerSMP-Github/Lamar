const { Message, Client, EmbedBuilder } = require('discord.js');
const { formatedDate } = require("../../assets/api/time/index");
const fetch = require("axios");

module.exports = {
  name: 'github',
  description: "Github User Account Information!",
  usage: "[ github username ]",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    try {

      if (!args[0]) return message.reply(`Please Give Me A Username!`)

      fetch(`https://api.github.com/users/${args.join('-')}`)
        .then(body => {
          if (body.data.message) return message.reply(`User Not Found | Please Give Me A Valid Username!`);
          let {
            login,
            avatar_url,
            name,
            id,
            html_url,
            public_repos,
            followers,
            following,
            location,
            created_at,
            bio
          } = body.data;

          const embed = new EmbedBuilder()
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

          message.reply({
            embeds: [embed]
          })

        })

    } catch (error) {
      console.log(`[Commands] [github] Getting Error In github Command :\n`, error);
      return message.reply(`Something Went Wrong Try Again Later!`)
    }

  }
}
