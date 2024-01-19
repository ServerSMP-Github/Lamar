const { GuessThePokemon } = require('discord-gamecord');
const { Message, Client } = require('discord.js');

module.exports = {
    name: 'pokemon',
    description : "Display an image of a Pokémon for a guessing game.",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        new GuessThePokemon({
          message: message,
          embed: {
            title: 'Who\'s This Pokemon?',
            footer: 'You have only 1 chance',
            color: '#5865F2',
          },
          time: 60000,
          othersMessage: 'You are not allowed to use buttons for this message!',
          winMessage: 'Your guess was correct! The pokemon was **{pokemon}**',
          stopMessage: 'Better luck next time! It was a **{pokemon}**',
          incorrectMessage: 'Your guess was incorrect! The pokemon was **{pokemon}**',
        }).startGame();
    }
}