module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId !== "delete-current-message") return;

    const msg = await interaction.channel.fetchMessage(interaction.message.id);

    await msg.delete();
}