const { EmbedBuilder, WebhookClient, ApplicationCommandOptionType, InteractionType  } = require("discord.js");
const customCommandModel = require("../models/server/cc-slash");
const profileSchema = require("../models/user/profile");
const cmdToggle = require("../models/server/cmd-slash");
const Userstats = require("../models/user/user-stats");
const client = require("../index");

client.on("interactionCreate", async (interaction) => {

  if (!interaction.guild) return interaction.followUp({
    content: "You have to be in a guild to use slash commands!"
  });

  async function profile() {
    profileSchema.findOne({
      User: interaction.member.user.id
    }, async (err, data) => {
      if (!data) {
        data = await new profileSchema({
          User: interaction.member.user.id,
          Name: interaction.member.user.username,
          Description: "",
          Status: "",
          Statustype: "auto",
          Descriminator: String(interaction.member.user.discriminator),
          Background: "minecraft",
          Owner: false,
          Level: 0,
          XP: 0,
          MaxXP: 0,
        });
      }

      const randomXp = Math.floor(Math.random() * 5) + 1;
      if (data.Level === 0 && data.XP === 0) {
        data.XP = Number(data.XP) + 10;
      } else data.XP = Number(data.XP) + randomXp;
      if (data.MaxXP === 0) data.MaxXP = Number(data.XP) * 5;

      if (data.XP >= data.MaxXP) {
        data.Level = Number(data.Level) + 1;
        data.XP = 0;
        data.MaxXP = Number(data.MaxXP) * 5;
      }

      data.save();
    });
  }
  profile();

  async function cmdUsed() {
    Userstats.findOne({
      User: interaction.member.user.id
    }, async (err, data) => {
      if (data) {
        data.CmdUsed = `${Number(data.CmdUsed) + 1}`;
        data.save();
      }
      if (!data) {
        new Userstats({
          User: interaction.member.user.id,
          CmdUsed: "1",
        }).save();
      }
    });

    if (client.config.bot.database.mongo_extra && await client.arkDB.has(`${client.user.username}-cmdUsed`)) await client.arkDB.set(`${client.user.username}-cmdUsed`, `${Number(await client.arkDB.get(`${client.user.username}-cmdUsed`)) + 1}`);
  }
  cmdUsed();

  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply({
      ephemeral: false
    }).catch(() => {});

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
          .setColor("YELLOW")
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

      if (!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.followUp({
        content: "You do not have permissions to use this command!",
        ephemeral: true
      })
      if (!interaction.guild.me.permissions.has(cmd.botPermission || [])) return interaction.followUp({
        content: "I do not have permission to use this command!",
        ephemeral: true
      });

      if (cmd.owner && !client.config.bot.owner.includes(interaction.member.user.id)) return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("RED")
            .setDescription("This command can only be used by the owners!")
        ]
      });

      const check = await cmdToggle.findOne({
        Guild: interaction.guild.id
      }).exec();

      if (check && check.Cmds.includes(cmd.name)) return interaction.followUp({
        content: 'This command has been disabled by admins.'
      });

      cmd.run(client, interaction, args);
    } else {
      const customCommand = await customCommandModel.findOne({
        commandName: interaction.commandName,
        guildId: interaction.guild.id
      }).exec();

      if (!customCommand) return interaction.followUp({
        content: "An error has occured"
      });

      return interaction.followUp({
        content: customCommand.response
      });

    }
  }

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({
      ephemeral: false
    }).catch(() => {});
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
          .setColor("YELLOW")
          .setTimestamp()
        ]
      });

      command.run(client, interaction);
    }
  }
});