const { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const roleSchema = require("../../models/server/roles-colors");
const ColorHelper = require('../../assets/api/color/index');
const { isColor } = require("coloras");

module.exports = {
    name: "role-color",
    description: "Make cool role colors.",
    type: ApplicationCommandType.ChatInput,
    options: [{
            name: "create",
            description: "create role color",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                    name: "name",
                    description: "name of color",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "color",
                    description: "color of role in hex",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
            ],
        },
        {
            name: "delete",
            description: "remove role color",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "name of color",
                type: ApplicationCommandOptionType.String,
                required: false
            }, ],
        },
        {
            name: "list",
            description: "remove role color",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "add",
            description: "add a role color",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "name of color",
                type: ApplicationCommandOptionType.String,
                required: true
            }, ],
        },
        {
            name: "remove",
            description: "remove a role color",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "name of color",
                type: ApplicationCommandOptionType.String,
                required: true
            }, ],
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const subCommand = interaction.options.getSubcommand();
        if (!interaction.guild.members.me.permissions.has("MANAGE_ROLES")) return interaction.followUp({
            content: "I do not have permission to use this command!",
            ephemeral: true
        });

        if (subCommand === "create") {
            if (!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.followUp({
                content: "You do not have permissions to use this command!",
                ephemeral: true
            });
            const optionColor = interaction.options.getString("color");
            const colorCheck = isColor(optionColor);
            if (colorCheck.color === true) {
                if (colorCheck.colorSystem === "hex") {
                    const colorName = interaction.options.getString("name");
                    if (colorName.length > 35) return interaction.followUp({
                        content: "Color name can't be more then 35 character."
                    });
                    roleSchema.findOne({
                        Guild: interaction.guild.id
                    }, async (err, data) => {
                        if (data) {
                            if (data.Color.includes(colorName.toLowerCase())) return interaction.followUp({
                                content: "A role color with that name allready exist."
                            });
                            if (data.Color.length >= 25) return interaction.followUp({
                                content: "A max of 25 role colors are allowed."
                            });
                            const role = await interaction.guild.roles.create({
                                name: colorName.toLowerCase(),
                                color: optionColor,
                                reason: 'ServerSMP - BOT Color roles'
                            });
                            data.Color.push({
                                "name": colorName.toLowerCase(),
                                "color": optionColor,
                                "id": role.id
                            });
                            data.save();
                            return interaction.followUp({
                                content: `Color role created ${colorName.toLowerCase()} with color ${optionColor}`
                            });
                        } else {
                            const role = await interaction.guild.roles.create({
                                name: colorName.toLowerCase(),
                                color: optionColor,
                                reason: 'ServerSMP - BOT Color roles'
                            });
                            new roleSchema({
                                Guild: interaction.guild.id,
                                Color: [{
                                    "name": colorName.toLowerCase(),
                                    "color": optionColor,
                                    "id": role.id
                                }],
                            }).save();
                            return interaction.followUp({
                                content: `Color role created ${colorName.toLowerCase()} with color ${optionColor}`
                            });
                        }
                    });
                } else return interaction.followUp({
                    content: "Color is not in hex"
                });
            } else return interaction.followUp({
                content: "Color is not a color"
            });
        } else if (subCommand === "delete") {
            if (!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.followUp({
                content: "You do not have permissions to use this command!",
                ephemeral: true
            });

            roleSchema.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    const colorName = interaction.options.getString("name");
                    if (colorName) {
                        let newData = [];
                        if (data.Color.length < 2) {
                            data.Color.forEach(async (cData) => {
                                if (cData.name === colorName.toLowerCase()) {
                                    const role = interaction.guild.roles.cache.get(cData.id);
                                    role.delete();
                                    data.delete();
                                    return interaction.followUp({
                                        content: `Deleted ${colorName.toLowerCase()} from the database.`
                                    });
                                }
                            });
                        }
                        data.Color.forEach(async (cData) => {
                            if (cData.name === colorName.toLowerCase()) {
                                const role = interaction.guild.roles.cache.get(cData.id);
                                return role.delete();
                            }
                            newData.push(cData);
                        });
                        data.Color = newData;
                        data.save();
                        return interaction.followUp({
                            content: `Deleted ${colorName.toLowerCase()} from the database.`
                        });
                    } else {
                        data.Color.forEach(async (cData) => {
                            const role = interaction.guild.roles.cache.get(cData.id);
                            role.delete();
                        });
                        data.delete();
                        return interaction.followUp({
                            content: "Deleted role color."
                        });
                    }
                } else return interaction.followUp({
                    content: "You don't have role color data."
                })
            });
        } else if (subCommand === "list") {
            roleSchema.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (data) {
                    let colorList = [];
                    await data.Color.forEach(async (dataList) => {
                        // data.Color.map(async(_,i) => {
                        colorList.push({
                            name: `**${dataList.name}**`,
                            value: `\`${dataList.color}\` **-** *${await ColorHelper.findClosestColor(dataList.color)}*`
                        });
                        // });
                    });
                    return interaction.followUp({
                        embeds: [{
                            color: 0x0099ff,
                            title: 'Role Colors',
                            fields: colorList,
                        }]
                    })
                } else return interaction.followUp({
                    content: "This guild does not have role color data."
                });
            });
        } else if (subCommand === "add") {
            const colorName = interaction.options.getString("name");
            roleSchema.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (!data) return interaction.followUp({
                    content: "This guild does not have role color data."
                });
                if (data) {
                    data.Color.forEach(async (colorData) => {
                        if (colorData.name === colorName) {
                            if (!interaction.member.roles.cache.has(colorData.id)) {
                                interaction.member.roles.add(colorData.id);
                                return interaction.followUp({
                                    content: `Added ${colorData.name} to ${interaction.member.user.username}!`
                                });
                            } else return interaction.followUp({
                                content: `You allready have role color ${colorName}!`
                            });
                        }
                    });
                }
            });
        } else if (subCommand === "remove") {
            const colorName = interaction.options.getString("name");
            roleSchema.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (!data) return interaction.followUp({
                    content: "This guild does not have role color data."
                });
                if (data) {
                    data.Color.forEach(async (colorData) => {
                        if (colorData.name === colorName) {
                            if (interaction.member.roles.cache.has(colorData.id)) {
                                interaction.member.roles.remove(colorData.id);
                                return interaction.followUp({
                                    content: `Removed ${colorData.name} to ${interaction.member.user.username}!`
                                });
                            } else return interaction.followUp({
                                content: `You do not have color role ${colorName}!`
                            })
                        }
                    });
                }
            });
        }
    },
};