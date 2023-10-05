const { Client, CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { isValidHexCode, findClosestColor } = require("../../assets/api/color");
const roleSchema = require("../../models/server/roles-colors");

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
            }],
        },
        {
            name: "delete",
            description: "remove role color",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "name of color",
                type: ApplicationCommandOptionType.String,
                required: true
            }],
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
            }],
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
            }],
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

        if (subCommand === "create") {

            if (!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.followUp({ content: "You do not have permissions to use this command!", ephemeral: true });

            const optionColor = interaction.options.getString("color");

            const colorCheck = isValidHexCode(optionColor);
            if (colorCheck.color !== true && colorCheck.colorSystem !== "hex") return interaction.followUp({ content: "Color is invalid", ephemeral: true });

            const colorName = interaction.options.getString("name");
            if (colorName.length > 35) return interaction.followUp({ content: "Color name can't be more then 35 character.", ephemeral: true });

            const roleData = await roleSchema.findOne({ Guild: interaction.guild.id });

            if (roleData) {
                if (roleData.Color.includes(colorName.toLowerCase())) return interaction.followUp({ content: "A role color with that name allready exist.", ephemeral: true });
                if (roleData.Color.length >= 25) return interaction.followUp({ content: "A max of 25 role colors are allowed.", ephemeral: true });

                const role = await interaction.guild.roles.create({
                    name: colorName.toLowerCase(),
                    color: optionColor,
                    reason: 'Lamar - Color roles'
                });

                roleData.Color.push({
                    "name": colorName.toLowerCase(),
                    "color": optionColor,
                    "id": role.id
                });

                await roleData.save();

                return interaction.followUp({ content: `Color role created ${colorName.toLowerCase()} with color ${optionColor}` });
            } else {
                const role = await interaction.guild.roles.create({
                    name: colorName.toLowerCase(),
                    color: optionColor,
                    reason: 'ServerSMP - BOT Color roles'
                });

                await roleSchema.create({
                    Guild: interaction.guild.id,
                    Color: [{
                        "name": colorName.toLowerCase(),
                        "color": optionColor,
                        "id": role.id
                    }],
                })

                return interaction.followUp({ content: `Color role created ${colorName.toLowerCase()} with color ${optionColor}` });
            }

        } else if (subCommand === "delete") {

            if (!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.followUp({ content: "You do not have permissions to use this command!", ephemeral: true });

            const colorName = (interaction.options.getString("name")).toLowerCase();

            const roleData = await roleSchema.findOne({ Guild: interaction.guild.id });

            if (!roleData) return interaction.followUp({ content: "This guild does not have role color data.", ephemeral: true });

            for (let index = 0; index < roleData.Color.length; index++) {
                const element = roleData.Color[index];

                if (element.name === colorName) {
                    (interaction.guild.roles.cache.get(id)).delete();
                    roleData.Color.filter(color => color.name === element.name);
                    await roleData.save();
                }

                if (colorName === "all") await roleData.deleteOne();

            }

            const content = colorName == 'all' ? "Deleted all role color data." : `Deleted ${colorName.toLowerCase()} from the database.`;

            return interaction.followUp({ content: content });

        } else if (subCommand === "list") {

            const roleData = await roleSchema.findOne({ Guild: interaction.guild.id });

            if (!roleData) return interaction.followUp({ content: "This guild does not have role color data.", ephemeral: true });

            let colorList = [];

            for (let index = 0; index < roleData.Color.length; index++) {
                const element = roleData.Color[index];

                colorList.push({
                    name: `**${element.name}**`,
                    value: `\`${element.color}\` **-** *${await findClosestColor(element.color)}*`
                });

            }

            return interaction.followUp({
                embeds: [{
                    color: 0x0099ff,
                    title: 'Role Colors',
                    fields: colorList,
                }]
            });

        } else if (subCommand === "add") {

            const colorName = interaction.options.getString("name");

            const roleData = await roleSchema.findOne({ Guild: interaction.guild.id });

            if (!roleData) return interaction.followUp({ content: "This guild does not have role color data.", ephemeral: true });

            for (let index = 0; index < roleData.Color.length; index++) {
                const element = roleData.Color[index];

                if (element.name !== colorName) return;

                if (interaction.member.roles.cache.has(element.id)) return interaction.followUp({ content: `You already have role color ${colorName}!`, ephemeral: true });

                interaction.member.roles.add(colorData.id);

                return interaction.followUp({ content: `Added ${colorData.name} to ${interaction.member.user.username}!` });

            }

        } else if (subCommand === "remove") {

            const colorName = interaction.options.getString("name");

            const roleData = await roleSchema.findOne({ Guild: interaction.guild.id });

            if (!roleData) return interaction.followUp({ content: "This guild does not have role color data.", ephemeral: true });

            for (let index = 0; index < roleData.Color.length; index++) {
                const element = roleData.Color[index];

                if (element.name !== colorName) return;

                if (!interaction.member.roles.cache.has(element.id)) return interaction.followUp({ content: `You do not have color role ${colorName}!`, ephemeral: true });

                interaction.member.roles.remove(element.id);

                return interaction.followUp({ content: `Removed ${element.name} to ${interaction.member.user.username}!` });

            }

        }
    },
};