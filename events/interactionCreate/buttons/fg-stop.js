const instance = require("../../../models/user/fg-instance");
const { EmbedBuilder } = require("discord.js");

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("fg-stop")) return;

    const button = interaction.customId.split("fg-stop-")[1];
    const user = interaction.member.user;

    if (button !== user.id) return interaction.reply({ content: "You are not allowed to click on this interaction", ephemeral: true });

    const getInstance = await instance.findOne({ guild: interaction.guild.id, user: user.id });
    if (!getInstance) return interaction.reply({ content: "You have not challenged the bot!", ephemeral: true });

    await getInstance.delete();

    interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setColor("Random")
            .setTitle("Stopped challenge!")
            .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL()
            })
        ]
    });
}