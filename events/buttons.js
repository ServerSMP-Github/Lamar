const rankCardRequest = require('../models/management/rankcard-request');
const userRankcard = require("../models/user/user-rankcard");
const modText = require("../assets/api/modlogs/index.json");
const pollSchema = require('../models/server/poll-cmd');
const SchemaModLogs = require("../models/logs/modlogs");
const { EmbedBuilder } = require('discord.js');
// const simplydjs = require('simply-djs');
const client = require("../index");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("modlog")) {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "You don't have perms.", ephemeral: true });

            const modData = await pollSchema.findOne({ Guild: interaction.guild.id });

            if (!modData) return interaction.reply({ content: "You do not have modlogs turned on", ephemeral: true });

            const modType = interaction.customId.split("modlog-")[1];

            if (modType) {
                const type = modData[modType];

                const current = type == true ? false : true;

                type = current;
            }

            await modData.save();

            interaction.reply({ content: `Turn **${current == true ? "on" : "off"}** \`${modText[modType]}\` modlog.`, ephemeral: true });

        } else if (interaction.customId === "rank-card-yes") {
            if (interaction.channel.id !== client.config.channel.ids.rankcard) return interaction.reply("ERROR - Channel id")
            rankCardRequest.findOne({
                Mesaage: interaction.message.id
            }, async (mainErr, mainData) => {
                if (!mainData) return interaction.reply("ERROR - No data in json");
                if (mainData) {
                    userRankcard.findOne({
                        User: mainData.User
                    }, async (err, data) => {
                        if (!data) return interaction.reply("ERROR - No data in Mongoose");
                        if (data) {
                            data.Background = mainData.Background;
                            data.save().then(async () => {
                                client.users.cache.get(mainData.User).send("Your RankCard image was accepted!");
                                await mainData.delete();
                                await interaction.message.delete(interaction.message.id);
                            });
                        }
                    });
                }
            });

        } else if (interaction.customId === "rank-card-deny") {
            if (interaction.channel.id !== client.config.channel.ids.rankcard) return interaction.reply("ERROR - Channel id")
            rankCardRequest.findOne({
                Mesaage: interaction.message.id
            }, async (err, data) => {
                if (!data) return interaction.reply("ERROR - No data in json");
                if (data) {
                    await client.users.cache.get(data.User).send("Your RankCard image was denyed!");
                    await data.delete();
                    await interaction.message.delete(interaction.message.id);
                }
            });

        } else if (interaction.customId === "rank-card-delete") {
            if (interaction.channel.id !== client.config.channel.ids.rankcard) return interaction.reply("ERROR - Channel id")
            rankCardRequest.findOne({
                Mesaage: interaction.message.id
            }, async (err, data) => {
                if (!data) return interaction.reply("ERROR - No data in json");
                if (data) {
                    await data.delete();
                    await interaction.message.delete(interaction.message.id);
                }
            });

        } else if (interaction.customId === "delete-current-message") {
            interaction.channel.fetchMessage(interaction.message.id).then(msg => msg.delete());

        } else if (interaction.customId.slice(0, 4) === 'poll') {
            let pollData = await pollSchema.findOne({ messageId: interaction.message.id })

            if (!pollData) return

            if (pollData) {
                var obj = pollData.users;
                let index = obj?.findIndex((obj => obj.number === interaction.customId.slice(4) && obj.user === interaction.user.id))

                if (index === -1) {

                    pollData = await pollSchema.findOneAndUpdate({ messageId: interaction.message.id }, {
                        $push: {
                            users: { number: interaction.customId.slice(4), user: interaction.user.id },
                        },
                    })

                    let irows = interaction.message.components

                    for (let i = 0; i < irows.length; i++) {

                        let index2 = irows[i].components.findIndex(obj => obj.customId === interaction.customId)

                        if (index2 === -1) {
                            continue;
                        } else {

                            let num = Number(irows[i].components[index2].label)

                            irows[i].components[index2].label = num + 1;

                            interaction.update({ components: irows })

                        }
                    }
                } else {

                    pollData = await pollSchema.findOneAndUpdate({ messageId: interaction.message.id }, {
                        $pull: {
                            users: { number: interaction.customId.slice(4), user: interaction.user.id },
                        },
                    })

                    let irows = interaction.message.components

                    for (let i = 0; i < irows.length; i++) {

                        let index2 = irows[i].components.findIndex(obj => obj.customId === interaction.customId)

                        if (index2 === -1) {
                            continue;
                        } else {

                            let num = Number(irows[i].components[index2].label)

                            irows[i].components[index2].label = num - 1;

                            interaction.update({ components: irows })
                        }
                    }

                }
            }

        } else if (interaction.customId.startsWith("roles")) {

            const roleID = interaction.customId.split('-')[1];

            if (interaction.member.roles.cache.has(roleID)) {
                interaction.member.roles.remove(roleID);
                interaction.reply({
                    content: `You have removed <@&${roleID}> role`,
                    ephemeral: true
                });
            } else {
                interaction.member.roles.add(roleID);
                interaction.reply({
                    content: `You have added <@&${roleID}> role`,
                    ephemeral: true
                });
            }

        }

    }

    // simplydjs.clickBtn(interaction);
});
