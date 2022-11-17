const { CommandInteraction, Client, ActionRowBuilder, EmbedBuilder, ApplicationCommandType, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'minesweeper',
    description: 'Play a game of minesweeper',
    type: ApplicationCommandType.ChatInput,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        var arr = [
            [0, 0, 0, '💣', '💣'],
            [0, 0, 0, '💣', 0],
            [0, 0, 0, 0, '💣'],
            [0, 0, 0, 0, '💣'],
            [0, 0, 0, '💣', '💣', 0],
        ];

        function placeBombs(array) {
            for (let row = 0; row < array.length; row++) {
                let currentIndex = array[row].length,
                    randomIndex;
                while (currentIndex != 0) {

                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;

                    [array[row][currentIndex], array[row][randomIndex]] = [
                        array[row][randomIndex], array[row][currentIndex]
                    ];
                }
            }
            return array;
        }
        placeBombs(arr)

        function count(data, i, j) {
            let c = 0;

            const prevRow = data[i - 1];
            const currentRow = data[i]
            const nextRow = data[i + 1];

            [prevRow, currentRow, nextRow].forEach(row => {
                if (row) {
                    if (row[j - 1] == '💣') c++;
                    if (row[j] == '💣') c++;
                    if (row[j + 1] == '💣') c++;
                }
            })
            return c;
        }

        function update(data) {
            return data.map((a, i) => {
                return a.map((b, j) => {
                    return b == '💣' ? b : count(data, i, j)
                })
            })
        }

        const result = update(arr)
        arr = result;
        let positions = []

        for (let row = 0; row < arr.length; row++) {
            for (let col = 0; col < arr[row].length; col++) {
                if (arr[row][col] === '💣') {
                    let obj = {
                        r: {
                            emoji: `💣`,
                            style: ButtonStyle.Danger,
                            custom_id: `bomb${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral1${row}${col}`,
                            type: 2,
                        },
                        b: {
                            emoji: `💥`,
                            style: ButtonStyle.Danger,
                            custom_id: `boom${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 0) {
                    let obj = {
                        r: {
                            emoji: `0️⃣`,
                            style: ButtonStyle.Success,
                            custom_id: `0${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            emoji: `0️⃣`,
                            style: ButtonStyle.Success,
                            custom_id: `neutral0${row}${col}`,
                            disabled: true,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 1) {
                    let obj = {
                        r: {
                            emoji: `1️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `1${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral2${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 2) {
                    let obj = {
                        r: {
                            emoji: `2️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `2${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral3${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 3) {
                    let obj = {
                        r: {
                            emoji: `3️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `3${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral3${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 4) {
                    let obj = {
                        r: {
                            emoji: `4️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `4${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral4${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 5) {
                    let obj = {
                        r: {
                            emoji: `5️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `5${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral5${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 6) {
                    let obj = {
                        r: {
                            emoji: `6️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `6${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral6${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 7) {
                    let obj = {
                        r: {
                            emoji: `7️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `7${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral7${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 8) {
                    let obj = {
                        r: {
                            emoji: `8️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `8${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral8${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                } else if (arr[row][col] === 9) {
                    let obj = {
                        r: {
                            emoji: `9️⃣`,
                            style: ButtonStyle.Primary,
                            custom_id: `9${row}${col}`,
                            disabled: true,
                            type: 2,
                        },
                        a: {
                            label: `-`,
                            style: ButtonStyle.Secondary,
                            custom_id: `neutral9${row}${col}`,
                            type: 2,
                        }
                    }
                    positions.push(obj)
                }
            }
        }

        let row1 = new ActionRowBuilder()
            .addComponents(positions[0].a, positions[1].a, positions[2].a, positions[3].a, positions[4].a)
        let row2 = new ActionRowBuilder()
            .addComponents(positions[5].a, positions[6].a, positions[7].a, positions[8].a, positions[9].a)
        let row3 = new ActionRowBuilder()
            .addComponents(positions[10].a, positions[11].a, positions[12].a, positions[13].a, positions[14].a)
        let row4 = new ActionRowBuilder()
            .addComponents(positions[15].a, positions[16].a, positions[17].a, positions[18].a, positions[19].a)
        let row5 = new ActionRowBuilder()
            .addComponents(positions[20].a, positions[21].a, positions[22].a, positions[23].a, positions[24].a)

        let game = new EmbedBuilder()
            .setDescription(`**${interaction.user}'s Minesweeper Game**`)
            .setColor("#6F8FAF")

        let msg = await interaction.followUp({
            embeds: [game],
            components: [row1, row2, row3, row4, row5],
            fetchReply: true
        })

        const filter = i => i.user.id === interaction.user.id;
        let collector = msg.createMessageComponentCollector({
            filter,
            time: 120000,
        })
        collector.on('collect', async (i) => {
            if (!i.isButton()) return;
            i.deferUpdate();
            let used = positions.find(x => x.a.custom_id === i.customId);
            if (used.r.style === 'DANGER') {
                collector.stop()
            }

            used.a = used.r;
            let row1 = new ActionRowBuilder()
                .addComponents(positions[0].a, positions[1].a, positions[2].a, positions[3].a, positions[4].a)
            row2 = new ActionRowBuilder()
                .addComponents(positions[5].a, positions[6].a, positions[7].a, positions[8].a, positions[9].a)
            row3 = new ActionRowBuilder()
                .addComponents(positions[10].a, positions[11].a, positions[12].a, positions[13].a, positions[14].a)
            row4 = new ActionRowBuilder()
                .addComponents(positions[15].a, positions[16].a, positions[17].a, positions[18].a, positions[19].a)
            row5 = new ActionRowBuilder()
                .addComponents(positions[20].a, positions[21].a, positions[22].a, positions[23].a, positions[24].a)

            interaction.editReply({
                components: [row1, row2, row3, row4, row5]
            })
        })

        collector.on('end', async (i, reason) => {
            if (reason === "time") {
                interaction.editReply({
                    embeds: [game.setDescription(`**${interaction.user}'s Took To Long So I Stoped The Game**`)],
                    components: []
                })
            } else {
                positions.forEach((g) => {
                    g.a = g.r
                    row1 = new ActionRowBuilder()
                        .addComponents(positions[0].a, positions[1].a, positions[2].a, positions[3].a, positions[4].a)
                    row2 = new ActionRowBuilder()
                        .addComponents(positions[5].a, positions[6].a, positions[7].a, positions[8].a, positions[9].a)
                    row3 = new ActionRowBuilder()
                        .addComponents(positions[10].a, positions[11].a, positions[12].a, positions[13].a, positions[14].a)
                    row4 = new ActionRowBuilder()
                        .addComponents(positions[15].a, positions[16].a, positions[17].a, positions[18].a, positions[19].a)
                    row5 = new ActionRowBuilder()
                        .addComponents(positions[20].a, positions[21].a, positions[22].a, positions[23].a, positions[24].a)
                })
                interaction.editReply({
                    content: '💥 *Explosion Sounds*',
                    components: [row1, row2, row3, row4, row5]
                })
            }
        });
    },
};