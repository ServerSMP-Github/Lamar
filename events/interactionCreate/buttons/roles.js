module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("roles")) return;

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