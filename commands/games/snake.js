const { Message, Client } = require('discord.js');
const { newGame } = require('../../client/snake');

module.exports = {
  name: 'snake',
  aliases : ['snakegame'],
  description : "Enjoy a game of Snake right in Discord.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message);
  }
}