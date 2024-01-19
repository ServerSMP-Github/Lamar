const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');
const api = require('../../assets/api/axolotl/axolotl.json');
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
  name: 'axolotl',
  aliases: ["axoltl"],
  description: "Display a random image and a fact about axolotls.",

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async (client, message, args) => {
    const { description, author } = api.facts[getRandomInt(0, api.facts.length)];

    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle("Axolotl")
        .setDescription(`${description} - ${author}`)
        .setImage("attachment://image.jpg")
        .setColor("Random")
      ],
      files: [
        new AttachmentBuilder(`./assets/api/axolotl/${getRandomInt(0, 115)}.webp`, { name: 'image.webp' })
      ]
    })
  }
}
