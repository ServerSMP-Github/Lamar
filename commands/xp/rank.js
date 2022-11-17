const { Message, Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const guildRankcard = require("../../models/server/guild-rankcard");
const userRankcard = require("../../models/user/user-rankcard");
const progressbar = require('../../assets/api/progressbar');
const xpSchema = require("../../models/server/xp");
const TextEssence = require('text-essence');
const canvacord = require("canvacord");
const Levels = require('discord-xp');

module.exports = {
    name: "rank",
    usage: "[ @user? ]",
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

      const getUser = message.mentions.members.first() ? message.mentions.members.first() : message.member;
      const checkUser = getUser.user.id == client.user.id ? message.member : getUser;

      const userXp = await Levels.fetch(checkUser.user.id, message.guild.id, true);
      if (!userXp) return message.reply("You dont have xp. try to send some messages.");

      const totalXp = Levels.xpFor(userXp.level + 1);
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

      const status = checkUser.presence?.status ? checkUser.presence.status : "offline";

      const userCardData = await userRankcard.findOne({ User: checkUser.user.id });
      const guildCardData = await guildRankcard.findOne({ Guild: message.guild.id });

      const backgroundArray = [null, undefined, "default"];

      const userBackground = !backgroundArray.includes(userCardData?.Background);
      const guildBackground = !backgroundArray.includes(guildCardData?.Background);

      const progressColor = userCardData?.ProgressBar ? userCardData.ProgressBar : guildCardData?.ProgressBar ? guildCardData.ProgressBar : "#ffffff";
      const backgroundUrl = userBackground ? userCardData.Background : guildBackground ? guildCardData.Background : null;
      const statusStyle = userCardData?.StatusStyle ? userCardData.StatusStyle : guildCardData?.StatusStyle ? guildCardData.StatusStyle : false;

      const parsedName = TextEssence.essence(checkUser.user.username);
      const username = parsedName.charAt(0).toUpperCase() + parsedName.slice(1);

      const rankcard = new canvacord.Rank()
        .setAvatar(checkUser.user.displayAvatarURL({format: 'png', size: 512}))
        .setCurrentXP(currentXp)
        .setRequiredXP(totalXp)
        .setRank(positionXp)
        .setLevel(levelXp)
        .setStatus(status, statusStyle)
        .setProgressBar(progressColor)
        .renderEmojis(true)
        .setUsername(username)
        .setDiscriminator(checkUser.user.discriminator);

      if (backgroundUrl !== "default" && backgroundUrl !== null) rankcard
        .setBackground("IMAGE", backgroundUrl)
        .setOverlay("#ffffff", 0, false);

      const rankImg = await rankcard.build();

      message.channel.send({
        files: [
          new AttachmentBuilder(rankImg, { name: "RankCard.png" })
        ]
      });

    },
};
