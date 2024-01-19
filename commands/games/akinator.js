const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { Aki } = require("aki-api");
const isPlaying = new Set();

module.exports = {
    name: "akinator",
    aliases: ["aki"],
    description: "Initiate a game of Akinator, the guessing genie.",
    run: async (client, message, args) => {
        if (isPlaying.has(message.author.id)) return message.reply("You are already playing a game of Akinator. Please complete or cancel that game to start a new game.").catch(err => { });

        isPlaying.add(message.author.id);

        const aki = new Aki({ region: 'en', childMode: false, proxy: undefined });

        const waitMessage = await message.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Please Wait")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Starting a new game of Akinator for ${message.author.username}!`)
                .setColor("Random")
                .setFooter({ text: `Akinator game requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            ]
        });

        await aki.start();

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Yes")
                .setEmoji("✅")
                .setCustomId("y"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("No")
                .setEmoji("❌")
                .setCustomId("n"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Don't Know")
                .setEmoji("❓")
                .setCustomId("idk")
        )

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Probably")
                .setEmoji("🤔")
                .setCustomId("pb"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Probaby Not")
                .setEmoji("🙄")
                .setCustomId("pn"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Stop")
                .setEmoji("🛑")
                .setCustomId("stop"),
        )

        const startMessage = await waitMessage.edit({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle(`Question ${aki.currentStep + 1}`)
                .addFields(
                    {
                        name: "Question",
                        value: `${aki.question}`
                    },
                    {
                        name: "Progress",
                        value: `${aki.progress}%`
                    }
                )
                .setColor("Random")
                .setFooter({ text: `Akinator game requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            ],
            components: [row1, row2]
        });

        const filter = (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            return interaction.reply({
                content: `Only ${message.author.username} can use this interaction!`,
                ephemeral: true,
            });
        };

        const collector = startMessage.createMessageComponentCollector({
            filter,
            componentType: "BUTTON",
            time: 60000 * 5
        });

        collector.on("collect", async (interaction) => {
            if (interaction.customId === "y") await aki.step(0);
            if (interaction.customId === "n") await aki.step(1);
            if (interaction.customId === "idk") await aki.step(2);
            if (interaction.customId === "pb") await aki.step(3);
            if (interaction.customId === "pn") await aki.step(4);
            if (interaction.customId === "stop") {
                row1.components[0].setDisabled(true);
                row1.components[1].setDisabled(true);
                row1.components[2].setDisabled(true);
                row2.components[0].setDisabled(true);
                row2.components[1].setDisabled(true);
                row2.components[2].setDisabled(true);

                await startMessage.edit({ content: "This game has been stopped", components: [row1, row2] });

                collector.stop();
                isPlaying.delete(message.author.id);
            }

            if (aki.progress >= 90 || aki.currentStep >= 48) {
                await aki.win();

                collector.stop();
                isPlaying.delete(message.author.id);

                const row3 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Yes")
                        .setEmoji("✅")
                        .setCustomId("yes"),

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("No")
                        .setEmoji("❌")
                        .setCustomId("no"),
                )

                await interaction.update({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Is this your character?")
                        .setDescription(`**Name:** ${aki.answers[0].name}\n\n${aki.answers[0].description}`)
                        .setImage(aki.answers[0].absolute_picture_path)
                        .setColor("Random")
                        .setFooter({ text: `Akinator game requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    ],
                    components: [row3]
                });

                const buttoncollector = startMessage.createMessageComponentCollector({
                    filter,
                    componentType: "BUTTON",
                    time: 60000
                });

                buttoncollector.on("collect", async (interaction) => {
                    if (interaction.customId === "yes") {
                        const yesEmbed = new EmbedBuilder()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Guessed it correctly!")
                            .addFields(
                                {
                                    name: `Name`,
                                    value: `${aki.answers[0].name}`,
                                    inline: true
                                },
                                {
                                    name: `Description`,
                                    value: `${aki.answers[0].description}`,
                                    inline: true
                                },
                                {
                                    name: `Ranking`,
                                    value: `${aki.answers[0].ranking}`,
                                    inline: true
                                }
                            )
                            .setColor("#39FF14")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setImage(aki.answers[0].absolute_picture_path)
                            .setFooter({ text: `Akinator game requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                        row3.components[0].setDisabled(true);
                        row3.components[1].setDisabled(true);

                        interaction.update({ embeds: [yesEmbed], components: [row3] });
                    }
                    if (interaction.customId === "no") {
                        const yesEmbed = new EmbedBuilder()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("You win!")
                            .setDescription(`You win this time, but I will definitely with the next time!\n\nWell Played!`)
                            .setColor("#FF0000")
                            .setThumbnail(client.user.displayAvatarURL())
                            .setFooter({ text: `Akinator game requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                        row3.components[0].setDisabled(true);
                        row3.components[1].setDisabled(true);

                        interaction.update({ embeds: [yesEmbed], components: [row3] });
                    }
                })
            } else {
                const continueEmbed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTitle(`Question ${aki.currentStep + 1}`)
                    .addFields(
                        {
                            name: "Question",
                            value: `${aki.question}`
                        },
                        {
                            name: "Progress",
                            value: `${aki.progress}%`
                        }
                    )
                    .setColor("Random")
                    .setFooter({ text: `Akinator game requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                interaction.update({ embeds: [continueEmbed], components: [row1, row2] });
            }
        });
    }
}
