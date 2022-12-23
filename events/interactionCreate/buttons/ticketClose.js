const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("closeticket")) return;

    const modRole = interaction.guild.roles.cache.find(role => role.name === "TicketMOD");

    if (!interaction.member.roles.cache.has(modRole.id)) return interaction.reply({ content: "You do not have permission to do this!", ephemeral: true });

    const user = interaction.customId.split("-")[2];

    interaction.channel.permissionOverwrites.delete(user);

    interaction.message.edit({
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`deleteticket-${interaction.guild.id}`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🗑️"),
                new ButtonBuilder()
                .setCustomId(`openticket-${interaction.guild.id}-${user}`)
                .setLabel("Open")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔓")
            )
        ]
    });

    await interaction.deferUpdate();
}