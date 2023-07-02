const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  name: "help",
  description: "Show All Commands",
  type: ApplicationCommandType.ChatInput,

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const { member } = interaction;

    const botColor = interaction.guild.members.me.displayHexColor;
    const color = botColor === "#000000" ? "#ffffff" : botColor;

    let categories = [];

    readdirSync("./SlashCommands/").forEach((dir) => {
      const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.map((command) => {
        let file = require(`../../SlashCommands/${dir}/${command}`);

        if (!file.name) return "No command name.";

        let name = file.name.replace(".js", "");
        let description = file.description;

        return `\`${name}\` : ${description} \n`;
      });

      let data = new Object();

      data = {
        name: `${dir.charAt(0).toUpperCase() + dir.slice(1)}:`,
        value: cmds.length === 0 ? "In progress." : cmds.join(" "),
      };

      categories.push(data);
    });

    return interaction.followUp({ embeds: [
      new EmbedBuilder()
        .setColor(color)
        .addFields(categories)
        .setTitle("Who Wants my Help?")
        .setDescription(`Here are List of My Commands!\n`)
        .setFooter({ text: `Requested By ${member.user.username}` })
    ]});
  },
};
