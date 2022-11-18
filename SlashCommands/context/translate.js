const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const translate = require("@iamtraction/google-translate")

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

        const translated = (await axios.post(`${client.config.translate.url}/translate`, {
            q: msg.content,
            source: "auto",
            target: "en",
            api_key: client.config.translate.key
        })).data;

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setFooter({ text: `${interaction.user.tag}` })
                .setTimestamp()
                .addField("Text To Translate:", `\`\`\`${msg.content.slice(0, 950)}\`\`\``)
                .addField("Translateted Text:", `\`\`\`${translated.translatedText.slice(0, 950)}\`\`\``)
                .setColor("Blue")
            ]
        });

    },
};