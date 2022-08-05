const { Client, CommandInteraction, EmbedBuilder, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "avatar",
    type: "USER",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
      const { user } = interaction.guild.members.cache.get(interaction.targetId);

      if (user.displayAvatarURL({ dynamic: true }).endsWith('.gif')) str += ` [gif](${user.displayAvatarURL({ dynamic: true })})`;

      const embed = new EmbedBuilder()
          .setTitle(`${user.username}'s avatar`)
          .setDescription(`[jpg](${user.displayAvatarURL({ format: 'jpg' })}) | [webp](${user.displayAvatarURL()}) | [png](${user.displayAvatarURL({ format: 'png' })})`)
          .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
          .setColor("Random")

      interaction.followUp({ embeds: [embed] });
    },
};
