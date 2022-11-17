const { Client, CommandInteraction, ApplicationCommandType } = require("discord.js");
const figlet = require("figlet");

module.exports = {
  name: "Ascii",
  type: ApplicationCommandType.Message,
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const msg = await interaction.channel.messages.fetch(interaction.targetId);

    figlet.text(
      `${msg.content}`,
      {
        font: "Standard"
      },
      async (err, data) => {
        interaction.followUp({ content: `\`\`\`${data.slice(0, 1975)}\`\`\`` });
      }
    );

  },
};
