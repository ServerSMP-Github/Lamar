const modText = require("../../../assets/api/modlogs/index.json");
const modSchema = require("../../../models/logs/modlogs");
const { PermissionsBitField } = require("discord.js");

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("modlog")) return;

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "You don't have perms.", ephemeral: true });

    const modData = await modSchema.findOne({ Guild: interaction.guild.id });

    if (!modData) return interaction.reply({ content: "You do not have modlogs turned on", ephemeral: true });

    const modType = interaction.customId.split("modlog-")[1];

    if (modType) {
        const type = modData[modType];

        const current = type == true ? false : true;

        type = current;
    }

    await modData.save();

    interaction.reply({ content: `Turn **${current == true ? "on" : "off"}** \`${modText[modType]}\` modlog.`, ephemeral: true });
}