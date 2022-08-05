const {
  MessageAttachment,
  EmbedBuilder,
  Message,
  Client
} = require('discord.js');
const data = require('../../assets/api/undertalemp3/undertalemp3.json');

module.exports = {
  name: 'undertale',
  description: "Random Undertale song",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const random = Math.floor(Math.random() * 101);
    const authorImage = new MessageAttachment(`./assets/api/undertalemp3/${data.author.img}`, `author.jpg`);
    const albumImage = new MessageAttachment(`./assets/api/undertalemp3/${data.art}`, data.art);
    const music = new MessageAttachment(`./assets/api/undertalemp3/${random}.mp3`, `${data.tracks[random]}.mp3`);
    message.reply({
      embeds: [
        new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(data.tracks[random])
        .setThumbnail(`attachment://${data.art}`)
        .setFooter({
          text: data.author.name,
          iconURL: `attachment://author.jpg`
        })
      ],
      files: [albumImage, authorImage, music]
    })
  }
}
