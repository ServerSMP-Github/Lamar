const { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

module.exports = {
    name: 'tictactoe',
    description: 'A game of ttt',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'opponent',
            description: 'Who you want to play with',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        new TicTacToe({
            message: interaction,
            slash_command: true,
            opponent: interaction.options.getUser('opponent'),
            embed: {
                title: 'Tic Tac Toe',
                overTitle: 'Game Over',
                color: '#5865F2',
            },
            oEmoji: '🔵',
            xEmoji: '❌',
            blankEmoji: '➖',
            oColor: 'PRIMARY',
            xColor: 'DANGER',
            waitMessage: 'Waiting for the opponent...',
            turnMessage: '{emoji} | Its now **{player}** turn!',
            askMessage: 'Hey {opponent}, {challenger} challenged you for a game of Tic Tac Toe!',
            cancelMessage: 'Looks like they refused to have a game of Tic Tac Toe. \:(',
            timeEndMessage: 'Since the opponent didnt answer, i dropped the game!',
            drawMessage: 'It was a draw!',
            winMessage: '{emoji} | **{winner}** won the game!',
            gameEndMessage: 'The game went unfinished :(',
        }).startGame();
    }
};