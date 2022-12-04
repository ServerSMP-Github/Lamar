const { newGame } = require("../../client/rockpaperscissors");
const { Message, Client } = require('discord.js');

module.exports = {
  name: 'rockpaperscissors',
  usage: '[@user]',
  aliases : ['rpc'],
  description : "Play rps in discord.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message, message.mentions.users.first())
  }
}