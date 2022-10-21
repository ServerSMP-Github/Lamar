const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');
const data = require('../../assets/api/undertalemp3/undertalemp3.json');

module.exports = {
  name: "undertale",
  description: "Random Undertale song",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    const random = Math.floor(Math.random() * 101);

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
      files: [
        new AttachmentBuilder(`./assets/api/undertalemp3/${random}.mp3`, { name: `${data.tracks[random]}.mp3` }),
        new AttachmentBuilder(`./assets/api/undertalemp3/${data.author.img}`, { name: `author.jpg` }),
        new AttachmentBuilder(`./assets/api/undertalemp3/${data.art}`, { name: data.art })
      ]
    });
  }
}
