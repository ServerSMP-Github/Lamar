const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const choice = { a1: 1, a2: 2, a3: 3, b1: 4, b2: 5, b3: 6, c1: 7, c2: 8, c3: 9 };
const tttSchema = require("../models/user/ttt.js");

async function newGame(message, opponent) {

    const userChallenger = message.author;
    const userOpponent = opponent;

    let gameBoard = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    let turn = userChallenger.id;
    let msg = null;

    const embed = new EmbedBuilder()
        .setTitle(`${userChallenger.username} vs. ${userOpponent.username}`)
        .setColor("#5865F2")

    async function getWinner(player) {
        if (gameBoard[0][0] == gameBoard[1][1] && gameBoard[0][0] == gameBoard[2][2] && gameBoard[0][0] == player) return true;

        if (gameBoard[0][2] == gameBoard[1][1] && gameBoard[0][2] == gameBoard[2][0] && gameBoard[0][2] == player) return true;

        for (let i = 0; i < 3; ++i) {
            if (gameBoard[i][0] == gameBoard[i][1] && gameBoard[i][0] == gameBoard[i][2] && gameBoard[i][0] == player) return true;

            if (gameBoard[0][i] == gameBoard[1][i] && gameBoard[0][i] == gameBoard[2][i] && gameBoard[0][i] == player) return true;
        }

        return false;
    }

    async function event() {
        const filter = button => button.customId.startsWith('ttt');

        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (button) => {
            if (button.user.id !== userChallenger.id && button.user.id !== userOpponent.id) return button.reply({ content: "You are not allowed to use buttons for this message!",  ephemeral: true });

            if (turn !== button.user.id) return button.reply({ content: "It is not your turn.",  ephemeral: true });

			await btn.deferUpdate();

			const index = choice[btn.customId.split('-')[1]] - 1;

            const x = index % 3;
            const y = Math.floor(index / 3);
        });
    }

    async function run() {
        if (!userOpponent) return message.reply("You must mention someone.");

        if (userOpponent.bot) return message.reply("You can't play with bots!");
        if (userOpponent.id === userChallenger.id) return message.reply("You cannot play with yourself!");

        const tttData = await tttSchema.findOne({ User: userChallenger.id });
        if (tttData) return message.reply({ content: "You are already playing tictactoe." });

        await tttSchema.create({ Guild: message.guild.id, User: userChallenger.id });
        await tttSchema.create({ Guild: message.guild.id, User: userOpponent.id });

        const row1 = new ActionRowBuilder()
        const row2 = new ActionRowBuilder()
        const row3 = new ActionRowBuilder()

        for (let i = 1; i < 4; i++) row1.addComponents(
            new ButtonBuilder()
            .setCustomId(`ttt-a${i}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("➖")
        );

        for (let i = 1; i < 4; i++) row2.addComponents(
            new ButtonBuilder()
            .setCustomId(`ttt-b${i}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("➖")
        );

        for (let i = 1; i < 4; i++) row3.addComponents(
            new ButtonBuilder()
            .setCustomId(`ttt-c${i}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("➖")
        );

        msg = await message.channel.send({
            embeds: [embed],
            components: [row1, row2, row3]
        });

        event();
    }

    run();

}

module.exports = { newGame }; 