const { Message, Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { canvacordRank, discordRank } = require("../../assets/api/canvas/rankcard");
const { createProfile } = require("../../assets/api/canvas/profile");
const guildRankcard = require("../../models/server/guild-rankcard");
const userRankcard = require("../../models/user/user-rankcard");
const progressbar = require('../../assets/api/progressbar');
const { fetchUser, xpFor } = require("../../assets/api/xp");
const { cleanText } = require('../../assets/api/text');
const xpSchema = require("../../models/server/xp");

module.exports = {
  name: "rank",
  usage: "[ @user? ]",
  aliases: ['level'],
  description: "Show's you're rank card (xp/level).",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const xpData = await xpSchema.findOne({ Guild: message.guild.id });
    if (!xpData) return message.reply("XP system is disabled on this server!");

    const getUser = message.mentions.members.last() ? message.mentions.members.last() : message.member;
    const checkUser = getUser.user.id == client.user.id ? message.member : getUser;

    const userXp = await fetchUser(checkUser.user.id, message.guild.id, true);
    if (!userXp) return message.reply("You dont have xp. try to send some messages.");

    const totalXp = xpFor(userXp.level + 1);
    const positionXp = userXp.position;
    const levelXp = userXp.level;
    const currentXp = userXp.xp;

    if (getUser.user.id === client.user.id) return message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setTitle(`${checkUser.user.username}'s Rank`)
        .setDescription(`**Rank**: \`${positionXp}\`\n**Level**: \`${levelXp}\`\n**XP**: \`${progressbar(client, currentXp, totalXp, 40, "□", "■")} ${currentXp}/${totalXp}\``)
        .setThumbnail(checkUser.user.displayAvatarURL({ format: 'png', size: 512 }))
        .setColor("Random")
      ]
    });

    const userCardData = await userRankcard.findOne({ User: checkUser.user.id });
    const guildCardData = await guildRankcard.findOne({ Guild: message.guild.id });

    const backgroundArray = [null, undefined, "default"];

    const userBackground = !backgroundArray.includes(userCardData?.Background);
    const guildBackground = !backgroundArray.includes(guildCardData?.Background);

    const progressColor = userCardData?.ProgressBar ? userCardData.ProgressBar : guildCardData?.ProgressBar ? guildCardData.ProgressBar : "#ffffff";
    const backgroundUrl = userBackground ? userCardData.Background : guildBackground ? guildCardData.Background : null;
    const statusStyle = userCardData?.StatusStyle ? userCardData.StatusStyle : guildCardData?.StatusStyle ? guildCardData.StatusStyle : false;
    const status = userCardData?.StatusType ? userCardData?.StatusType : checkUser.presence?.status ? checkUser.presence.status : "offline";

    const username = cleanText(checkUser.user.username);

    if (args[0] === "profile") {
      const profile = await createProfile({
        avatar: checkUser.user.displayAvatarURL({ extension: 'png', size: 512 }),
        id: message.author.id,
        username: username,
        status: status,
        guildOwner: (await message.guild.fetchOwner()).id,
        bot: {
            owners: client.config.bot.owner,
            avatar: client.user.displayAvatarURL({ extension: 'png', size: 512 })
        },
        level: levelXp,
        currentXP: currentXp,
        requiredXP: totalXp,
        progressBar: progressColor ? progressColor : "#00ff00"
      });

      return message.channel.send({
        files: [
          new AttachmentBuilder(profile, { name: "profile.png" })
        ]
      });
    }

    if (args[0] === "card") {
      const card = await discordRank({
        avatar: checkUser.user.displayAvatarURL({ extension: 'png', size: 512 }),
        username: username,
        status: status,
        level: levelXp,
        rank: positionXp,
        currentXP: currentXp,
        requiredXP: totalXp,
        color: progressColor ? progressColor : "#0CA7FF"
      });

      return message.channel.send({
        files: [
          new AttachmentBuilder(card, { name: "card.png" })
        ]
      });
    }

    const rankCard = await canvacordRank({
      background: backgroundUrl ? backgroundUrl : null,
      avatar: checkUser.user.displayAvatarURL({ extension: 'png', size: 512 }),
      username: username,
      status: {
        style: status,
        type: statusStyle
      },
      level: levelXp,
      rank: positionXp,
      currentXP: currentXp,
      requiredXP: totalXp,
      progressBar: progressColor ? progressColor : null
    });

    message.channel.send({
      files: [
        new AttachmentBuilder(rankCard, { name: "RankCard.png" })
      ]
    });

  },
};
