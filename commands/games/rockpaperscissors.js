const { newGame } = require("../../client/rockpaperscissors");
const { Message, Client } = require('discord.js');

module.exports = {
  name: 'rockpaperscissors',
  usage: '[user]',
  aliases : ['rpc'],
  description : "Play Rock, Paper, Scissors in Discord against another user.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message, message.mentions.users.first())
  }
}