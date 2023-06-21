const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { combineImages } = require("../../../assets/api/canvas");
const { randomHexColor } = require("../../../assets/api/color");
const logDataSchema = require("../../../models/logs/logsData");
const chart = require("../../../assets/api/canvas/chart");

module.exports = {
    name: "logs",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off", "get"].includes(options)) return message.reply("Invalid arguments");

        const logData = await logDataSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            if (logData) return message.reply("Logs is already on.");

            await logDataSchema.create({
                Guild: message.guild.id,
                Messages: 0,
                MessagesDelete: 0,
                MessagesEdit: 0,
                ChannelCreate: [],
                ChannelDelete: [],
                ChannelPinUpdate: [],
                ChannelUpdate: [],
                EmojiCreate: [],
                EmojiDelete: [],
                EmojiUpdate: [],
                BanAdd: [],
                BanRemove: [],
                MemberAdd: [],
                MemberRemove: [],
                MemberUpdate: [],
            });

            return message.channel.send("Turned on Logs.");
        }

        if (options === "off") {
            if (!logData) return message.reply("Logs is already off.");

            await logData.delete();

            return message.channel.send("Turned off Logs.");
        }

        if (options === "get") {
            const arguments = args[2]?.toLowerCase();
            if (!["web", "msg"].includes(arguments)) return message.reply("Invalid arguments");

            if (!logData) return message.reply("Logs is not on.");

            const { port, domain, customDomain } = client.config.dashboard;

            if (arguments === "web") return message.channel.send(`${customDomain ? domain : `${domain}:${port}`}/api/logs/${message.guild.id}`);
            else if (arguments === "msg") {
                const months = {
                    "01": "january",
                    "02": "february",
                    "03": "march",
                    "04": "april",
                    "05": "may",
                    "06": "june",
                    "07": "july",
                    "08": "august",
                    "09": "september",
                    "10": "october",
                    "11": "november",
                    "12": "december"
                };

                const data = {
                    cc: logData.ChannelCreate,
                    cd: logData.ChannelDelete,
                    cpu: logData.ChannelPinUpdate,
                    cu: logData.ChannelUpdate,
                    ec: logData.EmojiCreate,
                    ed: logData.EmojiDelete,
                    eu: logData.EmojiUpdate,
                    ba: logData.BanAdd,
                    br: logData.BanRemove,
                    ma: logData.MemberAdd,
                    mr: logData.MemberRemove,
                    mu: logData.MemberUpdate,
                };

                const result = {};

                for (const key in data) {
                    result[key] = [];
                    for (const month in months) {
                        result[key].push(0);
                    }
                    data[key].forEach(value => {
                        const match = value.match(/-(\d{1,2})$/);
                        if (match) {
                            const monthValue = match[1].padStart(2, "0");
                            const index = parseInt(monthValue) - 1;
                            result[key][index] += 1;
                        }
                    });
                }

                const color = randomHexColor();

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(message.guild.name)
                        .setThumbnail(message.guild.iconURL())
                        .setColor(color)
                        .addFields(
                            {
                                name: "Users",
                                value: `${message.guild.members.cache.size}`,
                                inline: true
                            },
                            {
                                name: "Roles",
                                value: `${message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).length}`,
                                inline: true
                            },
                            {
                                name: "Channels",
                                value: `${message.guild.channels.cache.size}`,
                                inline: true
                            },
                            {
                                name: "Messages",
                                value: `${logData.Messages}`,
                                inline: true
                            },
                            {
                                name: "Messages Deleted",
                                value: `${logData.MessagesDelete}`,
                                inline: true
                            },
                            {
                                name: "Messages Edited",
                                value: `${logData.MessagesEdit}`,
                                inline: true
                            }
                        ),
                        new EmbedBuilder()
                        .setAuthor({ name: "Channels Data" })
                        .setImage("attachment://channels.png")
                        .setColor(color),
                        new EmbedBuilder()
                        .setAuthor({ name: "Emoji Data" })
                        .setImage("attachment://emojis.png")
                        .setColor(color),
                        new EmbedBuilder()
                        .setAuthor({ name: "Bans Data" })
                        .setImage("attachment://bans.png")
                        .setColor(color),
                        new EmbedBuilder()
                        .setAuthor({ name: "Members Data" })
                        .setImage("attachment://members.png")
                        .setColor(color)
                    ],
                    files: [
                        new AttachmentBuilder(await combineImages([chart("ChannelCreate", result.cc), chart("ChannelDelete", result.cd), chart("ChannelPinUpdate", result.cpu), chart("ChannelUpdate", result.cu)], { width: 4050, columns: 4 }), { name: "channels.png" }),
                        new AttachmentBuilder(await combineImages([chart("EmojiCreate", result.ec), chart("EmojiDelete", result.ed), chart("EmojiUpdate", result.eu)], { width: 3040, columns: 3 }), { name: "emojis.png" }),
                        new AttachmentBuilder(await combineImages([chart("BanAdd", result.ba), chart("BanRemove", result.br)], { width: 2030, columns: 2 }), { name: "bans.png" }),
                        new AttachmentBuilder(await combineImages([chart("MemberAdd", result.ma), chart("MemberRemove", result.mr), chart("MemberUpdate", result.mu)], { width: 3040, columns: 3 }), { name: "members.png" })
                    ]
                });
            }
        }

    }
}