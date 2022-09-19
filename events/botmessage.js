const client = require('../index');
const xpSchema = require('../models/server/xp');
const { EmbedBuilder } = require('discord.js');

client.on("guildCreate", (guild) => {
  let channelToSend;
  guild.channels.cache.forEach((channel) => {
    if (channel.type === "GUILD_TEXT" && !channelToSend && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) channelToSend = channel;
  });
  if (!channelToSend) return;
  channelToSend.send({
    embeds: [
      new EmbedBuilder()
      .setColor("Random")
      .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
      .setDescription(`Thanks for inviting ${client.user.username} to your server!\nThe bot prefix is \`${client.config.bot.info.prefix}\` and for the list of commands do \`${client.config.bot.info.prefix}help\``)
      .addFields([
        { name: "TERMS OF SERVICE", value: "By inviting this bot you accept that I can log all data in your server and users." },
        { name: "BETA", value: "This bot is in beta so stuff will change." },
      ])
      .setTimestamp()
    ]
  });

  xpSchema.findOne({ Guild: guild.id }, (err, data) => {
    if (!data) {
      new xpSchema({
        Guild: guild.id,
        Channel: "false",
        Ping: false,
        WebUI: true,
        Rate: 6,
      }).save();
    }
  });
});
