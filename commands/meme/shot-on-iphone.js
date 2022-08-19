const { Message, Client } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'shot-on-iphone',
  description: "Get a random shot on iphone meme.",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const request = await axios.get("https://shot-on-iphone.studio/api/video");
      return message.channel.send(request.data.url)
    } catch (err) {
      console.error(err);
      return message.reply("An error occurred!");
    }
  }
}
