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
            message: msg.content,
            language: "en"
        });

        if (!translated || !translated.text) return interaction.followUp({ content: "There was an error while translating the text.", ephemeral: true });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setFooter({ text: `${interaction.user.username} - ${translated.iso} to en` })
                .setTimestamp()
                .addFields(
                    { name: "Text To Translate:", value: `\`\`\`${msg.content.slice(0, 950)}\`\`\`` },
                    { name: "Translateted Text:", value: `\`\`\`${translated.text?.slice(0, 950)}\`\`\`` }
                )
                .setColor('Blue')
            ]
        });

    },
};