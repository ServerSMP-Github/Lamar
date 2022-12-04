const { newGame } = require('../../client/trivia');
const { Message, Client } = require('discord.js');

module.exports = {
  name: 'trivia',
  category : 'games',
  description : "Play a trivia game in discord.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message);
  }
}