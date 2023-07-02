const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const translate = require("../../assets/api/translate");

module.exports = {
    name: "Translate",
    type: ApplicationCommandType.Message,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const msg = await interaction.channel.messages.fetch(interaction.targetId);

        const translated = await translate({
            client: client,
            message: msg.content
        });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setFooter({ text: `${interaction.user.username}` })
                .setTimestamp()
                .addFields(
                    { name: "Text To Translate:", value: `\`\`\`${msg.content.slice(0, 950)}\`\`\`` },
                    { name: "Translateted Text:", value: `\`\`\`${translated.slice(0, 950)}\`\`\`` }
                )
                .setColor('Blue')
            ]
        });

    },
};