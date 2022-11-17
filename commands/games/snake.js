const { Message, Client } = require('discord.js');
const { newGame } = require('../../client/snake');

module.exports = {
  name: 'snake',
  aliases : ['snakegame'],
  description : "You can play snake on discord.",
  /** 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  run: async(client, message, args) => {
    await newGame(message);
  }
}