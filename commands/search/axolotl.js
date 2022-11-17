const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');
const api = require('../../assets/api/axolotl/axolotl.json');

module.exports = {
  name: 'axolotl',
  description: "Random image and fact about axolotl.",
  aliases: ["axoltl"],

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    const { description, author } = api.facts[Math.floor(Math.random() * api.facts.length)];

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle("Axolotl")
        .setDescription(`${description} - ${author}`)
        .setImage("attachment://image.jpg")
        .setFooter({
          text: "Github: https://github.com/AxolotlAPI"
        })
        .setColor("Random")
      ],
      files: [
        new AttachmentBuilder(`./assets/api/axolotl/${api.images[Math.floor(Math.random() * api.images.length)]}`, { name: 'image.jpg' })
      ]
    })
  }
}
