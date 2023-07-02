const { createUser, setLevel } = require("../assets/api/xp");
const { EmbedBuilder, Events } = require('discord.js');
const getLeaderboard = require("../assets/api/mee6");
const xpSchema = require('../models/server/xp');
const client = require('../index');

client.on(Events.GuildCreate, async(guild) => {
  let channelToSend;
  guild.channels.cache.forEach((channel) => channel.type === "GUILD_TEXT" && !channelToSend && channel.permissionsFor(guild.me).has("SEND_MESSAGES") ? channelToSend = channel : null);
  if (!channelToSend) return;

  channelToSend.send({
    embeds: [
      new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
      .setDescription(`Thanks for inviting ${client.user.username} to your server!\nThe bot prefix is \`${client.config.bot.info.prefix}\` and for the list of commands do \`${client.config.bot.info.prefix}help\``)
      .addFields([
        { name: "TERMS OF SERVICE", value: "By inviting this bot you accept that I can log all data in your server and users." },
        { name: "ALPHA", value: "This bot is in alpha so stuff will change." },
      ])
      .setTimestamp()
    ]
  });

  const xpData = await xpSchema.findOne({ Guild: guild.id });
  if (xpData) return;

  await xpSchema.create({
    Guild: guild.id,
    Channel: "false",
    Ping: false,
    WebUI: true,
    Rate: 6,
  });

  const mee6Data = await getLeaderboard(guild.id);
  if (mee6Data?.error || !mee6Data) return;

  for (let index = 0; index < mee6Data.length; index++) {
    const element = mee6Data[index];

    await createUser(element.id, message.guild.id);
    if (element.level >= 1) await setLevel(element.id, message.guild.id, element.level);
    // if (element.xp >= 1) await Levels.appendXp(element.id, message.guild.id, element.xp);
  }

});
