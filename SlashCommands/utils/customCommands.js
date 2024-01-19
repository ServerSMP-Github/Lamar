const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const customCommandModel = require("../../models/server/cc-slash");

module.exports = {
    name: "custom",
    description: "Configure custom commands.",
    type: ApplicationCommandType.ChatInput,
    userPermissions: [PermissionsBitField.Flags.ManageMessages],
    options: [
      {
        name: "create",
        description: "create a custom command",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "command",
            description: "name of the custom command",
            type: ApplicationCommandOptionType.String,
            required: true
          },
          {
            name: "response",
            description: "response for this custom command",
            type: ApplicationCommandOptionType.String,
            required: true
          },
        ],
      },
      {
        name: "delete",
        description: "remove a custom command",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "command",
            description: "name of the custom command",
            type: ApplicationCommandOptionType.String,
            required: true
          },
        ],
      },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
      const subCommand = interaction.options.getSubcommand();
      const commandName = interaction.options.getString('command');
      const customCommand = await customCommandModel.findOne({ commandName, guildId: interaction.guild.id }).exec();

      if(subCommand === "create") {
        const response = interaction.options.getString('response');
        const properties = {
          commandName,
          response,
          guildId: interaction.guild.id,
        };

        if(!customCommand) {
          await customCommandModel.create(properties);
        } else {
          await customCommand.update(properties);
        }

        await interaction.guild.commands.create({
          name: commandName,
          description: "a custom command",
        });

        const embed = new EmbedBuilder()
          .setTitle("custom commands")
          .addFields([
            { name: 'name', value: commandName },
            { name: 'response', value: response }
          ])

        return interaction.followUp({ embeds: [embed] });
      } else if(subCommand === "delete") {
        if(!customCommand) return interaction.followUp({ content: "that custom command does not exist" });

        await customCommand.deleteOne();
        const command = await interaction.guild.commands.cache.find(cmd => cmd.name === commandName);

        await interaction.guild.commands.delete(command.id);
        return interaction.followUp({ content: "Custom command has been deleted" });
      }
    },
};
