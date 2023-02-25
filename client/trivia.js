const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandom } = require("../assets/api/crypto");

async function newGame(message) {

    let msg = null;

    const data = {};

    const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true }) })
        .setTitle("Trivia")
        .setColor("Random")

    function shuffle(a) {
        let j, x, i;

        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(getRandom() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    async function getTrivia() {
        const result = (await (await fetch("https://opentdb.com/api.php?amount=1&type=multiple&difficulty=hard")).json()).results[0];

        result.incorrect_answers.push(result.correct_answer);

        let shuffled = shuffle(result.incorrect_answers);
        shuffled = shuffled.map(e => decodeURIComponent(e))

        data.question = decodeURIComponent(result.question);
        data.difficulty = result.difficulty;
        data.category = decodeURIComponent(result.category);
        data.options = shuffled;
        data.correct = shuffled.indexOf(result.correct_answer)

        data.winnerID = `${(data.correct + 1)}-trivia`;
    }

    await getTrivia();

    async function event() {
        const filter = button => button.customId.endsWith('trivia') && button.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ filter, idle: 60000 });

        collector.on('collect', async (button) => {
            collector.stop();
			await button.deferUpdate();

            return endGame(button.customId);
        });

        collector.on('end', async (collect, reason) => {
            if (reason == 'idle') return endGame();
        });
    }

    async function endGame(customId) {
        const selected = Number(customId?.split("-trivia")[0]);
        const correctAnswer = data.options[data.correct];

        msg.edit({
            content: data.winnerID === customId ? `Your answer was correct! It was **${correctAnswer}**!` : `Your answer was Incorrect! The correct answer was **${correctAnswer}**`,
            embeds: [embed],
            // change this
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setDisabled(true)
                    .setCustomId('1-trivia')
                    .setLabel(data.options[0])
                    .setStyle(0 === data.correct ? ButtonStyle.Success : 1 === selected ? ButtonStyle.Danger : ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setDisabled(true)
                    .setCustomId('2-trivia')
                    .setLabel(data.options[1])
                    .setStyle(1 === data.correct ? ButtonStyle.Success : 2 === selected ? ButtonStyle.Danger : ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setDisabled(true)
                    .setCustomId('3-trivia')
                    .setLabel(data.options[2])
                    .setStyle(2 === data.correct ? ButtonStyle.Success : 3 === selected ? ButtonStyle.Danger : ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setDisabled(true)
                    .setCustomId('4-trivia')
                    .setLabel(data.options[3])
                    .setStyle(3 === data.correct ? ButtonStyle.Success : 4 === selected ? ButtonStyle.Danger : ButtonStyle.Secondary)
                )
            ]
        });
    }

    async function run() {
        embed
            .setDescription(`**${data.question}**\nYou have 60 seconds to respond!`)
            .addFields([
                { name: "Difficulty", value: `\`${data.difficulty}\`` },
                { name: "Category", value: `\`${data.category}\`` }
            ]);

        msg = await message.channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('1-trivia')
                    .setLabel(data.options[0])
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('2-trivia')
                    .setLabel(data.options[1])
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('3-trivia')
                    .setLabel(data.options[2])
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('4-trivia')
                    .setLabel(data.options[3])
                    .setStyle(ButtonStyle.Primary)
                )
            ]
        });

        event();
    }

    run();

}

module.exports = { newGame };