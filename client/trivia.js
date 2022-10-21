const { EmbedBuilder, ModalSubmitFields } = require("discord.js");
const axios = require("axios");

async function newGame(message) {

    let msg = null;

    const data = {};

    const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true }) })
        .setTitle("Trivia")

    function shuffle(a) {
        let j, x, i;

        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    async function getTrivia() {
        const result = (await axios.get("https://opentdb.com/api.php?amount=1&type=multiple&difficulty=hard")).data.results[0];

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

    getTrivia()

    // {
    //     question: 'The film Mad Max: Fury Road features the Dies Irae  from which composer&#039;s requiem?',
    //     difficulty: 'hard',
    //     category: 'Entertainment: Film',
    //     options: [ 'Berlioz', 'Verdi', 'Brahms', 'Mozart' ],
    //     correct: 1
    // }

    async function event() {
        const filter = button => button.customId.startsWith('snake') && button.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (button) => {

        });

        collector.on('end', async (collect, reason) => {
            if (reason == 'time') return endGame();
        });
    }

    async function run() {
        embed
            .setDescription(`**${data.question}**\nYou have 60 seconds to respond!`)
            .addFields([
                { name: "Difficulty", value: `\`${data.difficulty}\`` },
                { name: "Category", value: `\`${data.category}\`` }
            ])

        msg = await message.channel.send({
            embeds: [embed],
            comments: [
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
        })
    }

}

module.exports = { newGame };