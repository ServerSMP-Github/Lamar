const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const modlogSchema = require("../../../models/logs/modlogs");

module.exports = {
  name: "modlogs",
  run: async (client, message, args) => {
    const options = args[1]?.toLowerCase();
    if (!["on", "off", "options"].includes(options)) return message.reply("Invalid arguments");

    const modlogData = await modlogSchema.findOne({ Guild: message.guild.id });

    if (options === "on") {
      const channel = message.mentions.channels.last();
      if (!channel) return message.reply("Please mention a channel!");

      if (!modlogData) await modlogSchema.create({
        Guild: message.guild.id,
        Channel: channel.id,
        chc: false,
        chd: false,
        chpu: false,
        chu: false,
        ed: false,
        ec: false,
        eu: false,
        gba: false,
        gbr: false,
        gma: false,
        gmr: false,
        gmc: false,
        gmu: false,
        rc: false,
        rd: false,
        ru: false,
        ivc: false,
        ivd: false,
        md: false,
        mu: false
      });
      else {
        modlogData.Channel = channel.id;
        await modlogData.save();
      }

      return message.channel.send(`${channel} has been saved as the modlogs channel!`);
    }

    if (options === "off") {
      if (!modlogData) return message.reply("This server has no modlogs channel!");

      await modlogData.deleteOne();

      return message.channel.send("Deleted modlogs channel!");
    }

    if (options === "options") {
      if (!modlogData) return message.reply("This server has no modlogs channel!");

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("modlog-chc")
          .setLabel("channelCreate")
          .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
          .setCustomId("modlog-chd")
          .setLabel("channelDelete")
          .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
          .setCustomId("modlog-chpu")
          .setLabel("channelPinsUpdate")
          .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
          .setCustomId("modlog-chu")
          .setLabel("channelUpdate")
          .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
          .setCustomId("modlog-ed")
          .setLabel("emojiDelete")
          .setStyle(ButtonStyle.Secondary)
        )

      const row2 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("modlog-ec")
          .setLabel("emojiCreate")
          .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
          .setCustomId("modlog-eu")
          .setLabel("emojiUpdate")
          .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
          .setCustomId("modlog-gba")
          .setLabel("guildBanAdd")
          .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
          .setCustomId("modlog-gbr")
          .setLabel("guildBanRemove")
          .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
          .setCustomId("modlog-gma")
          .setLabel("guildMemberAdd")
          .setStyle(ButtonStyle.Danger)
        )

      const row3 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("modlog-gmr")
          .setLabel("guildMemberRemove")
          .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
          .setCustomId("modlog-gmc")
          .setLabel("guildMemberChunk")
          .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
          .setCustomId("modlog-gmu")
          .setLabel("guildMemberUpdate")
          .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
          .setCustomId("modlog-rc")
          .setLabel("roleCreate")
          .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
          .setCustomId("modlog-rd")
          .setLabel("roleDelete")
          .setStyle(ButtonStyle.Success),
        )

      const row4 = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("modlog-ru")
          .setLabel("roleUpdate")
          .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
          .setCustomId("modlog-ivc")
          .setLabel("inviteCreate")
          .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
          .setCustomId("modlog-ivd")
          .setLabel("inviteDelete")
          .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
          .setCustomId("modlog-mu")
          .setLabel("messageDelete")
          .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
          .setCustomId("modlog-md")
          .setLabel("messageUpdate")
          .setStyle(ButtonStyle.Secondary)
        )

      message.channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle("ModLogs - Options")
          .setDescription("Click on the buttons to change stuff.")
          .setColor("Aqua")
        ],
        components: [row, row2, row3]
      });

      return message.channel.send({ content: "More buttons", components: [row4] });
    }
  }
}