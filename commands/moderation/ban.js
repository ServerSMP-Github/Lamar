const { ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle, Message, Client } = require('discord.js');

module.exports = {
    name: 'ban',
    usage: "[ user ]",
    description: "This command ban a member!",
    userPermission: [PermissionsBitField.Flags.BanMembers],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run(client, message, args) {

        const target = message.mentions.users.first();
        if (!target) return message.reply({ content: "Who are trying to ban? The chat?" });

        const memberTarget = message.guild.members.cache.get(target.id);
        message.delete();

        const filter = i => i.customId.startsWith("ban") && i.user.id;

        const collector = message.channel.createMessageComponentCollector({ filter, time: 25000 });

        collector.on('collect', async(interaction) => {
            if (interaction.customId === "ban-accept") {
                interaction.update({ content: "**Member baned**", components: [] });
                memberTarget.ban();
            } else if (interaction.customId === "ban-deny") interaction.update({ content: "**Member not baned**", components: [] });
        });

        message.channel.send({
            content: "**Ban command**",
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("ban-accept")
                    .setLabel("Approve ban")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                    new ButtonBuilder()
                    .setCustomId("ban-deny")
                    .setEmoji("🚫")
                    .setLabel("Disallow ban")
                    .setStyle(ButtonStyle.Danger)
                )
            ]
        });

    }
}