const { Client, CommandInteraction, ApplicationCommandType } = require("discord.js");
const { stringToAscii } = require("../../assets/api/ascii");

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

    const ascii = stringToAscii(msg.content);

    interaction.followUp({ content: `\`\`\`${ascii.slice(0, 1975)}\`\`\`` });
  },
};
