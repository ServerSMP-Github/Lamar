const { EmbedBuilder, Events, WebhookClient } = require('discord.js');
const blacklistSchema = require('../models/management/blacklist');
const nsfwList = require("../assets/api/cmd/nsfw.json");
const userSchema = require("../models/user/user-stats");
const botSchema = require("../models/logs/botStats");
const ccSchema = require('../models/server/cc');
const client = require("../index");

client.on(Events.MessageCreate, async (message) => {

  if (message.author.bot || !message.guild) return;

  const prefix = await client.prefix(message);

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) return message.channel.send({ content: `Prefix: \`${prefix}\`` });

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(" ");

  const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

  const ccData = await ccSchema.findOne({ Guild: message.guild.id, Command: cmd }).exec();
  if (ccData) return message.channel.send(ccData.Response);

  if (command) {

    const userData = await userSchema.findOne({ User: message.author.id }).exec();
    if (userData) {
      userData.CmdUsed = `${Number(userData.CmdUsed) + 1}`;

      await userData.save();
    } else userSchema.create({
      User: message.author.id,
      CmdUsed: "1",
    });

    const botStats = await botSchema.findOne({ Account: client.user.id });
    if (client.config.bot.database.mongo_extra && botStats) {
      botStats.CmdUsed = botStats.CmdUsed + 1;

      await botStats.save();
    }

    if (!nsfwList.includes(command.name)) new WebhookClient({ url: client.config.channel.webhooks.cmdlog }).send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
          .setDescription(`\`\`\`\n${client.config.bot.info.prefix}${command.name}\n\`\`\``)
          .setColor("Yellow")
          .setTimestamp()
      ]
    });

    const blacklistData = await blacklistSchema.findOne({ Server: message.guild.id }).exec();
    if (blacklistData) return message.reply("This server has been blacklisted.");

    if(!message.member.permissions.has(command.userPermission || [])) return message.channel.send("You do not have permission to use this command!");
    if(!message.guild.members.me.permissions.has(command.botPermission || [])) return message.channel.send("I do not have permission to use this command!");

    if (command.owner && !client.config.bot.owner.includes(message.author.id)) return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription("This command can only be used by the owners!")
      ]
    });

    await command.run(client, message, args);

  } else return;
});
