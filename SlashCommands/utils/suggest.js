const { Client, CommandInteraction, EmbedBuilder, WebhookClient, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "suggest",
    description: "Suggest ideas that should be added to the bot.",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "idea",
        description: "What you want to suggest?",
        type: ApplicationCommandOptionType.String,
        required: true
    }],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (!client.config.channel.webhooks.suggest) return interaction.followUp({ content: "This feature is disabled.", ephemeral: true });

        const suggestion = interaction.options.getString("idea");

        if (suggestion.length > 2000) return interaction.followUp({ content: "Suggestion can't be more then 2000 characters.", ephemeral: true });

        new WebhookClient({ url: client.config.channel.webhooks.suggest }).send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({
                    name: interaction.member.user.username,
                    iconURL: interaction.member.user.displayAvatarURL()
                })
                .setDescription(`\`\`\`${suggestion}\`\`\``)
                .setColor("#ffffff")
            ]
        });

        interaction.followUp({ content: "Suggestion sent!", ephemeral: true });
    },
};