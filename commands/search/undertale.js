const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');
const data = require('../../assets/api/undertalemp3/undertalemp3.json');
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
  name: "undertale",
  description: "Random Undertale song",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    const random = getRandomInt(1, 101);

    message.reply({
      embeds: [
        new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(data.tracks[random])
        .setThumbnail(`attachment://art.webp`)
        .setFooter({ text: data.author, iconURL: `attachment://author.webp` })
      ],
      files: [
        new AttachmentBuilder(`./assets/api/undertalemp3/${random}.mp3`, { name: `${data.tracks[random]}.mp3` }),
        new AttachmentBuilder(`./assets/api/undertalemp3/author.webp`, { name: "author.webp" }),
        new AttachmentBuilder(`./assets/api/undertalemp3/art.webp`, { name: "art.webp" })
      ]
    });
  }
}
