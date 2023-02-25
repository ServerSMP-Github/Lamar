const { newGame } = require("../../client/tictactoe");
const { Message, Client } = require('discord.js');

module.exports = {
  name: 'tictactoe',
  usage: '[@user]',
  aliases: ['ttt'],
  description : "Play tictactoe against another user.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message, message.mentions.users.first())
  }
}