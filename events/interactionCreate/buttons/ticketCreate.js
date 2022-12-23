const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async(interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("ticket")) return;

    const modRole = interaction.guild.roles.cache.find(role => role.name === "TicketMOD");

    const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [
                    PermissionsBitField.Flags.ViewChannel
                ],
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel
                ],
            },
            {
                id: modRole.id,
                allow: [
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ViewChannel
                ],
            },
        ],
    });

    channel.send({
        content: `<@&${modRole.id}>`,
        embeds: [
            new EmbedBuilder()
            .setTitle("Ticket Created")
            .setDescription(`Ticket has been raised by ${interaction.user}. The support will reach you shortly.\n\n\**User ID:** \`${interaction.user.id}\` | **User Tag:** \`${interaction.user.tag}\``)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor("Random")
            .setTimestamp()
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`deleteticket-${interaction.guild.id}`)
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🗑️"),
                new ButtonBuilder()
                .setCustomId(`closeticket-${interaction.guild.id}-${interaction.user.id}`)
                .setLabel("Close")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔒")
            )
        ]
    });

    interaction.reply({ content: `Your ticket has been created at ${channel}!`, ephemeral: true });
}