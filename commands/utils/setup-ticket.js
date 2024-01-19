const { Message, Client, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'setup-ticket',
  usage: "[channel?]",
  description: "Set up a ticketing system in the specified channel.",
  userPermission: [PermissionsBitField.Flags.ManageGuild],
  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async(client, message, args) => {
    const channel = message.mentions.channels.first() ? message.mentions.channels.first() : message.channel;

    if (!message.guild.roles.cache.some(role => role.name === "TicketMOD")) {
      const role = await message.guild.roles.create({ name: "TicketMOD" });
      message.member.roles.add(role);
    }

    channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle("Create a ticket")
        .setDescription("🎫 Create a ticket by clicking the button 🎫")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setColor("Random")
      ],
      components: [
        new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId(`ticket-${message.guild.id}`)
          .setLabel("Ticket")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🎫")
        )
      ]
    });
  }
}
