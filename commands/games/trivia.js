const { newGame } = require('../../client/trivia');
const { Message, Client } = require('discord.js');

module.exports = {
  name: 'trivia',
  description: "Engage in a trivia game right in Discord.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message);
  }
}