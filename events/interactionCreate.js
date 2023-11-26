const { EmbedBuilder, WebhookClient, ApplicationCommandOptionType, InteractionType, Events } = require("discord.js");
const customCommandModel = require("../models/server/cc-slash");
const userSchema = require("../models/user/user-stats");
const botSchema = require("../models/logs/botStats");
const client = require("../index");

client.on(Events.InteractionCreate, async (interaction) => {

  if (!interaction.guild) return interaction.reply({ content: "You have to be in a guild to use slash commands!" });

  const userStats = await userSchema.findOne({ User: interaction.member.user.id });
  if (userStats) {
    userStats.CmdUsed = userStats.CmdUsed + 1;

    await userStats.save();
  } else await userStats.create({ User: interaction.member.user.id, CmdUsed: "1" });

  const botStats = await botSchema.findOne({ Account: client.user.id });
  if (client.config.bot.database.mongo_extra && botStats) {
    botStats.CmdUsed = botStats.CmdUsed + 1;

    await botStats.save();
  }

  // Slash Command Handling
  if (interaction.type === InteractionType.ApplicationCommand) {
    await interaction.deferReply({ ephemeral: false }).catch(() => {});

    const cmd = client.slashCommands.get(interaction.commandName);

    if (cmd) {

      new WebhookClient({ url: client.config.channel.webhooks.cmdlog }).send({
        embeds: [
          new EmbedBuilder()
          .setAuthor({
            name: interaction.member.user.username,
            iconURL: interaction.member.user.displayAvatarURL()
          })
          .setDescription(`\`\`\`\n/${cmd.name}\n\`\`\``)
          .setColor("Yellow")
          .setTimestamp()
        ]
      })

      const args = [];

      for (let option of interaction.options.data) {
        if (option.type === ApplicationCommandOptionType.Subcommand) {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }

      interaction.member = interaction.guild.members.cache.get(interaction.user.id);

      if (!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.followUp({ content: "You do not have permissions to use this command!", ephemeral: true });

      if (!interaction.guild.members.me.permissions.has(cmd.botPermission || [])) return interaction.followUp({ content: "I do not have permission to use this command!", ephemeral: true });

      if (cmd.owner && !client.config.bot.owner.includes(interaction.member.user.id)) return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("This command can only be used by the owners!")
        ]
      });

      return cmd.run(client, interaction, args);
    } else {
      const customCommand = await customCommandModel.findOne({ commandName: interaction.commandName, guildId: interaction.guild.id }).exec();

      if (!customCommand) return interaction.followUp({ content: "An error has occured" });

      return interaction.followUp({ content: customCommand.response });

    }
  }

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: false }).catch(() => {});

    const command = client.slashCommands.get(interaction.commandName);
    if (command) {

      new WebhookClient({ url: client.config.channel.webhooks.cmdlog }).send({
        embeds: [
          new EmbedBuilder()
          .setAuthor({
            name: interaction.member.user.username,
            iconURL: interaction.member.user.displayAvatarURL()
          })
          .setDescription(`\`\`\`\n/${command.name}\n\`\`\``)
          .setColor("Yellow")
          .setTimestamp()
        ]
      });

      return command.run(client, interaction);
    }
  }
});