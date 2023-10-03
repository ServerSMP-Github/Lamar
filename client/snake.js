const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getRandom } = require("../assets/api/crypto");
const snakeSchema = require("../models/user/snake");
const apple = { x: 1, y: 1 };
const gameBoard = [];
const HEIGHT = 10;
const WIDTH = 15;

async function newGame(message) {

    let snake = [{ x: 5, y: 5 }];
    let snakeLength = 1;
    let msgEdit = null;
    let score = 0;

    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Snake Game")
        .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ format: 'png', dynamic: true }) });

    function setup() {
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                gameBoard[y * WIDTH + x] = '⬛';
            }
        }
    }

    setup();

    function makeGameBoard({ skull }) {
        let str = '';

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (x == apple.x && y == apple.y) {
                    str += '🍎';
                    continue;
                }

                let flag = true;

                const snakeArray = snake.length;

                for (let s = 0; s < snakeArray; s++) {
                    if (x == snake[s].x && y == snake[s].y) {
                        str += s == 0 ? skull ? '💀' : '🟢' : s == snakeArray - 1 ? '🟢' : '🟩';
                        flag = false;
                    }
                }

                if (flag) str += gameBoard[y * WIDTH + x];
            }

            str += '\n';
        }

        return str;
    }

    function snakePosition(pos) {
        return snake.find(sPos => sPos.x == pos.x && sPos.y == pos.y);
    }

    function appleLocation() {
        let newApplePos = { x: 0, y: 0 };

        do newApplePos = { x: parseInt(getRandom() * WIDTH), y: parseInt(getRandom() * HEIGHT) };
        while(snakePosition(newApplePos));

        apple.x = newApplePos.x;
        apple.y = newApplePos.y;
    }

    function step() {
        if (apple.x == snake[0].x && apple.y == snake[0].y) {
            score += 1;
            snakeLength++;

            appleLocation();
        }

        embed.setDescription(`**Score:** ${score}\n\n${makeGameBoard({ skull: false })}`);

        msgEdit.edit({ embeds: [embed] });
    }

    async function endGame() {
        const snakeData = await snakeSchema.findOne({ Guild: message.guild.id, User: message.author.id });
        if (snakeData) await snakeData.deleteOne();

        embed.setDescription(`**Game Over**\n**Score:** ${score}\n\n${makeGameBoard({ skull: true })}`);

        msgEdit.edit({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('snake-disabled-1')
                    .setLabel('\u200b')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setCustomId('snake-up')
                    .setLabel('⬆️')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('snake-disabled-2')
                    .setLabel('\u200b')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setCustomId('snake-stop')
                    .setLabel('Stop')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Danger),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('snake-left')
                    .setLabel('⬅️')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('snake-down')
                    .setLabel('⬇️')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('snake-right')
                    .setLabel('➡️')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary)
                )
            ]
        });
    }

    function button() {
        const filter = button => button.customId.startsWith('snake') && button.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ filter, idle: 60000 });

        collector.on('collect', async (button) => {
            const snakeHead = snake[0];
            const nextPos = { x: snakeHead.x, y: snakeHead.y };

            if (button.customId === 'snake-left') {
                let nextX = snakeHead.x - 1;
                if (nextX < 0) nextX = WIDTH - 1;
                nextPos.x = nextX;
                button.deferUpdate();
            } else if (button.customId === 'snake-up') {
                let nextY = snakeHead.y - 1;
                if (nextY < 0) nextY = HEIGHT - 1;
                nextPos.y = nextY;
                button.deferUpdate();
            } else if (button.customId === 'snake-down') {
                let nextY = snakeHead.y + 1;
                if (nextY >= HEIGHT) nextY = 0;
                nextPos.y = nextY;
                button.deferUpdate();
            } else if (button.customId === 'snake-right') {
                let nextX = snakeHead.x + 1;
                if (nextX >= WIDTH) nextX = 0;
                nextPos.x = nextX;
                button.deferUpdate();
            } else if (button.customId === 'snake-stop') {
                button.deferUpdate();
                return endGame();
            }

            if (snakePosition(nextPos)) endGame();
            else {
                snake.unshift(nextPos);
                if (snake.length > snakeLength) snake.pop();

                step();
            }
        });

        collector.on('end', async (collect, reason) => {
            if (reason == 'idle') return endGame();
        });
    }

    async function run() {
        const snakeData = await snakeSchema.findOne({ Guild: message.guild.id, User: message.author.id });
        if (snakeData) return message.reply({ content: "You are already playing snake." });

        await snakeSchema.create({ Guild: message.guild.id, User: message.author.id });

        score = 0;
        snakeLength = 1;
        snake = [{ x: 5, y: 5 }];

        appleLocation();

        embed.setDescription(`**Score:** ${score}\n\n${makeGameBoard({ skull: false })}`)

        message.channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('snake-disabled-1')
                    .setLabel('\u200b')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setCustomId('snake-up')
                    .setLabel('⬆️')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('snake-disabled-2')
                    .setLabel('\u200b')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                    .setCustomId('snake-stop')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('snake-left')
                    .setLabel('⬅️')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('snake-down')
                    .setLabel('⬇️')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('snake-right')
                    .setLabel('➡️')
                    .setStyle(ButtonStyle.Primary)
                )
            ]
        }).then(msg => {
            msgEdit = msg;

            button();
        });

    }

    run();

}

module.exports = { newGame };