module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("deleteticket")) return;

    const modRole = interaction.guild.roles.cache.find(role => role.name === "TicketMOD");

    if (!interaction.member.roles.cache.has(modRole.id)) return interaction.reply({ content: "You do not have permission to do this!", ephemeral: true });

    interaction.channel.delete();
}