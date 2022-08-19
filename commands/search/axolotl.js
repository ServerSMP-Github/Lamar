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
    const randomNumberImage = Math.floor(Math.random() * api.images.length);
    const randomNumberFact = Math.floor(Math.random() * api.facts.length);
    const randomFact = api.facts[randomNumberFact];
    const file = new AttachmentBuilder(`./assets/api/axolotl/${api.images[randomNumberImage]}`, { name: 'image.jpg' });
    message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle("Axolotl")
        .setDescription(`${randomFact.description} - ${randomFact.author}`)
        .setImage("attachment://image.jpg")
        .setFooter({
          text: "Github: https://github.com/AxolotlAPI"
        })
        .setColor("Random")
      ],
      files: [file]
    })
  }
}
