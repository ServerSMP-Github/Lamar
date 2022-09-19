const rankCardRequest = require('../models/management/rankcard-request');
const userRankcard = require("../models/user/user-rankcard");
const pollSchema = require('../models/server/poll-cmd');
const SchemaModLogs = require("../models/logs/modlogs");
const { EmbedBuilder } = require('discord.js');
const simplydjs = require('simply-djs');
const client = require("../index");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "modlog-chc") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.chc === true) {
                        data.chc = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `channelCreate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.chc = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `channelCreate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-chd") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.chd === true) {
                        data.chd = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `channelDelete` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.chd = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `channelDelete` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-chpu") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.chpu === true) {
                        data.chpu = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `channelPinsUpdate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.chpu = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `channelPinsUpdate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-chu") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.chu === true) {
                        data.chu = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `channelUpdate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.chu = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `channelUpdate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-ed") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.ed === true) {
                        data.ed = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `emojiDelete` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.ed = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `emojiDelete` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-ec") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.ec === true) {
                        data.ec = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `emojiCreate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.ec = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `emojiCreate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-eu") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.eu === true) {
                        data.eu = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `emojiUpdate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.eu = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `emojiUpdate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-gba") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.gba === true) {
                        data.gba = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `guildBanAdd` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.gba = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `guildBanAdd` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-gbr") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.gbr === true) {
                        data.gbr = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `guildBanRemove` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.gbr = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `guildBanRemove` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-gma") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.gma === true) {
                        data.gma = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `guildMemberAdd` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.gma = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `guildMemberAdd` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-gmr") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.gmr === true) {
                        data.gmr = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `guildMemberRemove` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.gmr = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `guildMemberRemove` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-gmc") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.gmc === true) {
                        data.gmc = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `guildMemberChunk` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.gmc = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `guildMemberChunk` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-gmu") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.gmu === true) {
                        data.gmu = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `guildMemberUpdate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.gmu = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `guildMemberUpdate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-rc") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.rc === true) {
                        data.rc = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `roleCreate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.rc = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `roleCreate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-rd") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.rd === true) {
                        data.rd = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `roleDelete` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.rd = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `roleDelete` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-ru") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.ru === true) {
                        data.ru = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `roleUpdate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.ru = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `roleUpdate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-ivc") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.ivc === true) {
                        data.ivc = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `inviteCreate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.ivc = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `inviteCreate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-ivd") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.ivd === true) {
                        data.ivd = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `inviteDelete` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.ivd = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `inviteDelete` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-mu") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.mu === true) {
                        data.mu = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `messageDelete` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.mu = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `messageDelete` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

        } else if (interaction.customId === "modlog-md") {
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({
                content: "You don't have perms.",
                ephemeral: true
            })
            SchemaModLogs.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    if (data.md === true) {
                        data.md = false;
                        data.save();
                        interaction.reply({
                            content: "Turn **on** `messageUpdate` modlog.",
                            ephemeral: true
                        })
                    } else {
                        data.md = true;
                        data.save();
                        interaction.reply({
                            content: "Turn **off** `messageUpdate` modlog.",
                            ephemeral: true
                        })
                    }
                }
            });

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

        } else if (interaction.customId.split('-')[0] === "roles") {

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

    } else if (interaction.isSelectMenu()) {
        if (interaction.customId === "BotFAQs") {
            const value = interaction.values;

            if (value == 'botInfo') return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Information")
                    .setDescription("A bot for all your needs! May it be moderation, info on things from your server, or even random pictures of ducks. We have it all!")
                    .setColor('#1abc9c')
                ],
                ephemeral: true
            })
            if (value == 'botInvite') return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Invite")
                    .setDescription("You can invite me to your server by clicking [here](https://discord.com/api/oauth2/authorize?client_id=778409873573412874&scope=applications.commands+bot&permissions=1073203574)")
                    .setColor('#1abc9c')
                ],
                ephemeral: true
            })
            if (value == 'botComms') return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Commands")
                    .setDescription("You can view all my commands by clicking [here](https://dash.serversmp.xyz/commands/)")
                    .setColor('#1abc9c')
                ],
                ephemeral: true
            })
            if (value == 'website') return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Website")
                    .setDescription("Dashboard: [https://dash.serversmp.xyz/](https://dash.serversmp.xyz/)\n Website: [https://serversmp.xyz/](https://serversmp.xyz/)")
                    .setColor('#1abc9c')
                ],
                ephemeral: true
            })
        }
    } else if (interaction.isModalSubmit()) {
        return;
    }

    // simplydjs.clickBtn(interaction);
});
