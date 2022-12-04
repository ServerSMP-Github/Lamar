const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const rpsSchema = require("../models/user/rps");

async function newGame(message, opponent) {

    const emoji = { "rock": "🪨", "paper": "📃", "scissors": "✂️" };

    const userChallenger = message.author;
    const userOpponent = opponent;

    let msgEdit = null;

    let challengerChoice = null;
    let opponentChoice = null;

    let winner = null;

    const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("Rock Paper Scissors")
        .setDescription("Press a button below to make a choice!")

    async function event() {
        const filter = button => button.customId.startsWith('rps');

        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (button) => {
            if (button.user.id !== userChallenger.id && button.user.id !== userOpponent.id) return button.reply({ content: "You are not allowed to use buttons for this message!",  ephemeral: true });

            if (button.user.id === userChallenger.id) {
                if (challengerChoice) return button.reply({ content: "You cannot change your selection!",  ephemeral: true });

                if (button.customId === "rps-rock") challengerChoice = "rock";
                else if (button.customId === "rps-paper") challengerChoice = "paper";
                else if (button.customId === "rps-scissors") challengerChoice = "scissors";

                button.reply({ content: `You choose ${emoji[challengerChoice]}!`,  ephemeral: true });
            } else if (button.user.id === userOpponent.id) {
                if (opponentChoice) return button.reply({ content: "You cannot change your selection!",  ephemeral: true });

                if (button.customId === "rps-rock") opponentChoice = "rock";
                else if (button.customId === "rps-paper") opponentChoice = "paper";
                else if (button.customId === "rps-scissors") opponentChoice = "scissors";

                button.reply({ content: `You choose ${emoji[opponentChoice]}!`,  ephemeral: true });
            }

            if (challengerChoice && opponentChoice) {
                // fix this logic
                switch (challengerChoice) {
                    case 'rock': {
                        if (!winner) {
                            if (opponentChoice === 'paper') winner = userOpponent;
                            else winner = userChallenger;
                        }
                    }
                    case 'paper': {
                        if (!winner) {
                            if (opponentChoice === 'scissors') winner = userOpponent;
                            else winner = userChallenger;
                        }
                    }
                    case 'scissors': {
                        if (!winner) {
                            if (opponentChoice === 'rock') winner = userOpponent;
                            else winner = userChallenger;
                        }
                    }
                }

                if (challengerChoice === opponentChoice) winner = "draw";
            }

            if (winner) {
                await (await rpsSchema.findOne({ User: userChallenger.id })).delete();
                await (await rpsSchema.findOne({ User: userOpponent.id })).delete();

                const winText = winner == "draw" ? "It was a draw!" : `${winner} won the game!`;

                embed
                    .setDescription(winText)
                    .setTimestamp()
                    .addFields([
                        { name: userChallenger.username, value: emoji[challengerChoice], inline: true },
                        { name: userOpponent.username, value: emoji[opponentChoice], inline: true }
                    ]);

                msgEdit.edit({
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('rps-rock')
                            .setLabel('🪨')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                            .setCustomId('rps-paper')
                            .setLabel('📃')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                            .setCustomId('rps-scissors')
                            .setLabel('✂️')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Primary)
                        )
                    ]
                });
            }
        });
    }

    async function run() {
        if (!userOpponent) return message.reply("You mush mention someone.");

        if (userOpponent.bot) return message.reply("You can't play with bots!");
        if (userOpponent.id === userChallenger.id) return message.reply("You cannot play with yourself!");

        const snakeData = await rpsSchema.findOne({ User: userChallenger.id });
        if (snakeData) return message.reply({ content: "You are already playing rock paper scissors." });

        await rpsSchema.create({ Guild: message.guild.id, User: userChallenger.id });
        await rpsSchema.create({ Guild: message.guild.id, User: userOpponent.id });

        message.channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('rps-rock')
                    .setLabel('🪨')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('rps-paper')
                    .setLabel('📃')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('rps-scissors')
                    .setLabel('✂️')
                    .setStyle(ButtonStyle.Primary)
                )
            ]
        }).then(msg => {
            msgEdit = msg;

            event();
        });
    }

    run()

}

module.exports = { newGame }; 