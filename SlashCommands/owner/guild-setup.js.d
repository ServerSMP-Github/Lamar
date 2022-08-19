const { Client, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
    name: "guild-setup",
    description: "Setup for the owner of the bot.",
    type: ApplicationCommandType.ChatInput,
    owner: true,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: "Prince527", iconURL: "https://serversmp.xyz/web/developers/assets/image/prince527.jpg", })
                .setDescription(`\`\`\`\n/<━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━>\n┃░▒█▀▀▀█░█▀▀░█▀▀▄░▄░░░▄░█▀▀░█▀▀▄░▒█▀▀▀█░▒█▀▄▀█░▒█▀▀█┃\n┃░░▀▀▀▄▄░█▀▀░█▄▄▀░░█▄█░░█▀▀░█▄▄▀░░▀▀▀▄▄░▒█▒█▒█░▒█▄▄█┃\n┃░▒█▄▄▄█░▀▀▀░▀░▀▀░░░▀░░░▀▀▀░▀░▀▀░▒█▄▄▄█░▒█░░▒█░▒█░░░┃\n<━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━>\n\`\`\`\n**Welcome To ServerSMP**\nServerSMP is many things!.`)
                .setColor("#1abc9c")
            ]
        });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle("Rules")
                .setDescription("**1. All [Discord ToS and Guidelines](https://discordapp.com/guidelines) apply. [Ban / Warn]\n 2. Racism will not be tolerated. [Ban]\n 3. Do not post malicious links or files. [Mute / Ban]\n 4. Do not beg for items (money, nitro or stuff). [Mute / Kick]\n 5. NSFW content is STRICTLY prohibited. [Instant Ban]\n 6. Do not use alts. [Alt acc will be kicked]\n 7. Do not spam. [Warn / Mute]\n 8. Don't use the music bot for earrape. [Mute / AntiVC]\n 8. No pinging for no reason. [Kick / Mute]\n 9. Use channels for their correct purpose. [Kick / Mute / Ban]\n 10. Be respectful. [Kick / Mute / Ban]**")
                .addField('What happens if you break a rule?', "Rules are only here to keep order and peace. Breaking the rules once or twice is fine, and will most likely be looked over, but repetitive rule breaking can, on the short end, lead to temporary mutes, and in severe cases, lead to temporary / permanent bans.\n\nJust be respectful, alright?")
                .setColor('#1abc9c')
            ]
        });

        const BotFAQs = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('BotFAQs')
                .setPlaceholder('Choose an option')
                .addOptions(
                    [
                        {
                            label: 'Information',
                            value: 'botInfo',
                            description: 'Bot information',
                        },
                        {
                            label: 'Invite',
                            value: 'botInvite',
                            description: 'Bot invite link',
                        },
                        {
                            label: 'Website',
                            value: 'website',
                            description: 'Bot Website',
                        },
                        {
                            label: 'Commands',
                            value: 'botComms',
                            description: 'Commands',
                        },
                    ]   
                )
            )

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle("Bot FAQs")
                .setDescription("Choose an option from the dropdown menu")
                .setColor('#1abc9c')
            ],
            components: [BotFAQs],
        });

    }
}