const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("openticket")) return;

    const modRole = interaction.guild.roles.cache.find(role => role.name === "TicketMOD");

    if (!interaction.member.roles.cache.has(modRole.id)) return interaction.reply({ content: "You do not have permission to do this!", ephemeral: true });

    const user = interaction.customId.split("-")[2];

    interaction.channel.permissionOverwrites.edit(user, { ViewChannel: true, SendMessages: true });

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
                .setCustomId(`closeticket-${interaction.guild.id}-${interaction.user.id}`)
                .setLabel("Close")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔒")
            )
        ]
    });

    await interaction.deferUpdate();
}