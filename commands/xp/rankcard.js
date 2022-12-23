const { Message, Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const rankCardRequest = require('../../models/management/rankcard-request');
const userRankcard = require('../../models/user/user-rankcard');
const { isValidHexCode } = require("../../assets/api/color");
const xpSchema = require("../../models/server/xp");

module.exports = {
  name: 'rankcard',
  usage: "[ list or #color ] [ true or false ] [ status or false ] [ image url or not ]",
  description : "Options for user rankcards.",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async(client, message, args) => {
    const xpData = await xpSchema.findOne({ Guild: message.guild.id });
    if (!xpData) return message.reply("XP system is disabled on this server!");

    let color = args[0]?.toLowerCase();
    let style = args[1]?.toLowerCase();
    let status = args[2]?.toLowerCase();
    let image = args[3];

    if (!color) return message.reply({ embeds: [
      new EmbedBuilder()
      .setTitle("RankCard Command")
      .setColor("Random")
      .addFields(
        {
          name: "Basic Colors",
          value: "🟢: `#008000`\n🟡: `#ffff00`\n🟠: `#ffa500`\n🔴: `#ff0000`\n🟣: `#800080`\n🔵: `#0000ff`\n⚫: `#000000`\n⚪: `#ffffff`"
        },
        {
          name: "Status Style",
          value: "🔴: `true`\n⭕: `false`"
        },
        {
          name: "Status Type",
          value: "🟢: `online`\n🟡: `idle`\n🔴: `dnd`\n⚫: `offline`\n🟣: `streaming`\n🌈: `false`"
        },
        {
          name: "URL",
          value: "Just add the url after status type or not."
        },
        {
          name: "Example",
          value: `\`${await client.prefix(message)}rankcard #ffff00 false idle https://prince527.reeee.ee/5ajFfZxeS.png\``
        },
        {
          name: "Schema",
          value: `\`${await client.prefix(message)}rankcard [ #color ] [ true or false ] [ status or false ] [ image url or not ]\``
        }
      )
    ]});

    if (!isValidHexCode(color)) return message.reply("Not a valid color");

    if(!["true", "false"].includes(style)) return message.reply("You need a status style (true or false)!");

    if(!["false", "dnd", "idle", "offline", "online", "streaming"].includes(status)) return message.reply("You need a status (dnd, idle, offline, online, streaming)!");

    if (client.config.channel.ids.rankcard && image) {
      if (!image.startsWith("http") && !(image.endsWith(".png") || image.endsWith(".jpeg") || image.endsWith(".jpg"))) return message.reply("If you want a image it has to start with `http` and end with `.png` or `.jpeg` or `.jpg`");

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId("rank-card-yes")
          .setLabel("Accept")
          .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
          .setCustomId("rank-card-deny")
          .setLabel("Deny")
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId("rank-card-delete")
          .setLabel("Delete")
          .setStyle(ButtonStyle.Secondary)
        )

      const embed = new EmbedBuilder()
        .setTitle(`${message.author.username}'s RankCard Image`)
        .setDescription("Just click one of the buttons to accept or deny the user's rankcard image.")
        .addFields(
          {
            name: "ImageURL",
            value: image,
          },
          {
            name: "UserID",
            value: message.author.id,
          }
        )
        .setColor("Random")

      const channel = client.channels.cache.get(client.config.channel.ids.rankcard);

      const rankCardData = await rankCardRequest.findOne({ User: message.author.id });
      if (!rankCardData) {
        const msg = await channel.send({ embeds: [embed], components: [row] });

        await rankCardRequest.create({ Mesaage: msg.id, User: message.author.id, Background: image });

      } else {
        await channel.messages.fetch(rankCardData.Message).then((msg) => msg.delete());

        await rankCardData.delete();

        const msg = await channel.send({ embeds: [embed], components: [row] });

        await rankCardRequest.create({ Mesaage: msg.id, User: message.author.id, Background: image });
      }
    }

    const userData = await userRankcard.findOne({ User: message.author.id });
    if (!userData) await userRankcard.create({ User: message.author.id, ProgressBar: color, StatusStyle: style, StatusType: status, Background: "default" });
    else {
      userData.ProgressBar = color;
      userData.StatusStyle = style;
      userData.StatusType = status;
      userData.Background = "default";

      await userData.save();
    }

    return message.reply("Data Saved!");
  }
}
