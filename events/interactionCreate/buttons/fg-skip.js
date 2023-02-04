const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomInt } = require("../../../assets/api/crypto");
const instance = require("../../../models/user/fg-instance");
const gameData = require("../../../assets/api/fg/game.json");

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("fg-skip")) return;

    const button = interaction.customId.split("fg-skip-")[1];
    const user = interaction.member.user;

    if (button !== user.id) return interaction.reply({ content: "You are not allowed to click on this interaction", ephemeral: true });

    const getInstance = await instance.findOne({ guild: interaction.guild.id, user: user.id });
    if (!getInstance) return interaction.reply({ content: "You have not challenged the bot!", ephemeral: true });

    const lastCountry = getInstance.country;

    const array = gameData.list;
    const country = array[getRandomInt(0, array.length)];

    getInstance.country = country;
    await getInstance.save();

    interaction.reply({
        content: `Skipped ${gameData.name[lastCountry]}!`,
        embeds: [
            new EmbedBuilder()
            .setTitle("Guess the flag?")
            .setImage(`https://flagcdn.com/w1280/${country}.png`)
            .setColor("Random")
            .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL()
            })
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`fg-stop-${user.id}`)
                .setLabel("Stop")
                .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                .setCustomId(`fg-skip-${user.id}`)
                .setLabel("Skip")
                .setStyle(ButtonStyle.Secondary)
            )
        ]
    });
}