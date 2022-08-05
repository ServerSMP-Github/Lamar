const {
    Client,
    CommandInteraction,
    MessageEmbed,
    WebhookClient
} = require("discord.js");

module.exports = {
    name: "suggest",
    description: "Suggest ideas that should be added to the bot.",
    options: [{
        name: "idea",
        description: "What you want to suggest?",
        type: "STRING",
        required: true
    }],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (!channelSettings.webhooks.suggest) return interaction.followUp({
            content: "This feature is disabled."
        });

        const suggestion = interaction.options.getString("idea");

        if (suggestion.length > 2000) return interaction.followUp({
            content: "Suggestion can't be more then 2000 characters."
        });

        new WebhookClient({
            url: client.config.channel.webhooks.suggest
        }).send({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: interaction.member.user.username,
                    iconURL: interaction.member.user.displayAvatarURL()
                })
                .setDescription(`\`\`\`${suggestion}\`\`\``)
                .setColor("#ffffff")
            ]
        });

        interaction.followUp({
            content: "Suggestion sent!"
        });
    },
};