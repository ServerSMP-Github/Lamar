const {
  Message,
  Client,
  MessageActionRow,
  MessageButton,
  EmbedBuilder,
  AttachmentBuilder
} = require('discord.js');
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
            .addField(`Username`, `${login}`)
            .addField(`ID`, `${id}`)
            .addField(`Bio`, `${bio || "No Bio"}`)
            .addField(`Public Repositories`, `${public_repos || "None"}`, true)
            .addField(`Followers`, `${followers}`, true)
            .addField(`Following`, `${following}`, true)
            .addField(`Location`, `${location || "No Location"}`)
            .addField(`Account Created`, formatedDate(created_at))

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
