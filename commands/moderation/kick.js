const { Message, Client, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'kick',
    usage: '[user]',
    description : "Kick a user from the server.",
    userPermission: [PermissionsBitField.Flags.KickMembers],
    botPermission: [PermissionsBitField.Flags.KickMembers],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const target = message.mentions.users.first();
        if (!target) return message.reply({ content: "Who are trying to ban? the chat?" })

        const memberTarget = message.guild.members.cache.get(target.id);

        if (memberTarget.roles.highest.position >= message.member.roles.highest.position) return message.reply({ content: "You can't kick this user." })

        message.delete();

        const filter = i => i.customId.startsWith("kick") && i.user.id;

        const collector = message.channel.createMessageComponentCollector({ filter, time: 25000 });

        collector.on('collect', async(interaction) => {
            if (interaction.customId === "kick-accept") {
                interaction.update({ content: "**Member kicked**", components: [] });
                memberTarget.ban();
            } else if (interaction.customId === "kick-deny") interaction.update({ content: "**Member not kicked**", components: [] });
        });

        message.channel.send({
            content: "**Kick command**",
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("kick-accept")
                    .setLabel("Approve kick")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("✅"),
                    new ButtonBuilder()
                    .setCustomId("kick-deny")
                    .setEmoji("🚫")
                    .setLabel("Disallow kick")
                    .setStyle(ButtonStyle.Danger)
                )
            ]
        })

    },
};