const { EmbedBuilder, WebhookClient, PermissionsBitField, ActivityType } = require("discord.js");
const { blacklistedwords } = require('../client/collection');
const Schema = require('../models/moderator/blackwords');
const colors = require('../assets/api/console');
const client = require("../index");
const { table } = require('table');

client.once("ready", async() => {

  const cmdCount = String(Number(client.commands.size) + Number(client.slashCommands.size));

  const activityName = client.config.bot.status.text
    .replace(/{guildsCount}/g, client.guilds.cache.size)
    .replace(/{usersCount}/g, client.users.cache.size)
    .replace(/{channelsCount}/g, client.channels.cache.size)
    .replace(/{commandCount}/g, cmdCount)
    .replace(/{botVersion}/g, client.config.bot.info.version)
    .replace(/{botName}/g, client.user.username)
    .replace(/{botPrefix}/g, client.config.bot.info.prefix);

  client.user.setPresence({ activities: [{ name: activityName, type: global.statusType }], status: client.config.bot.status.status });

  if (client.config.channel.webhooks.status) new WebhookClient({ url: client.config.channel.webhooks.status }).send({
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`:green_circle: Success!\n:robot: Connected To **${client.user.tag}**\n:eyes: Watching \`${client.users.cache.size}\` Users, \`${client.guilds.cache.size}\` Servers.\n:information_source: Prefix: \`${client.config.bot.info.prefix}\` || \`${cmdCount}\` Commands`)
        .setColor("Random")
        .setTimestamp()
    ]
  });

  Schema.find()
    .then((data) => {
      data.forEach((val) => {
        blacklistedwords.set(val.Guild, val.Words);
    });
  });

  client.guilds.cache
    .filter((g) => g.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild))
    .forEach((g) => g.invites.fetch({ cache: true }));

  if (client.config.bot.database.mongo_extra) {
    await client.arkDB.set(`${client.user.username}-guilds`, client.guilds.cache.size);
    await client.arkDB.set(`${client.user.username}-users`, client.users.cache.size);
    await client.arkDB.set(`${client.user.username}-channels`, client.channels.cache.size);
    await client.arkDB.set(`${client.user.username}-commands`, cmdCount);
    if (!await client.arkDB.has(`${client.user.username}-cmdUsed`)) await client.arkDB.set(`${client.user.username}-cmdUsed`, "0");
  }

  client.poru.init(client);

  global.startSpinner.succeed("Started BOT");

  console.log(table([
    [`${colors.fgGray("Connected To")} ${colors.fgYellow(`${client.user.tag}`)}`],
    [`${colors.fgWhite("Watching")} ${colors.fgRed(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`)} ${colors.fgWhite(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1 ? "Users + Bots," : "User,"}`)} ${colors.fgRed(`${client.guilds.cache.size}`)} ${colors.fgWhite(`${client.guilds.cache.size > 1 ? "Servers." : "Server."}`)}`],
    [`${colors.fgWhite(`MongoDB:`)} ${global.mongoStatus} ${colors.fgWhite("||")} ${colors.fgWhite(`Prefix:` + colors.fgRed(` ${client.config.bot.info.prefix}`))} ${colors.fgWhite("||")} ${colors.fgRed(cmdCount)} ${colors.fgWhite(`Commands`)}`],
  ], {
    columnDefault: {
      width: 50,
    },
    header: {
      alignment: 'center',
      content: `${colors.gradient(
        [
          `╔═══╗                  ╔═══╗╔═╗╔═╗╔═══╗`,
          `║╔═╗║                  ║╔═╗║║║╚╝║║║╔═╗║`,
          `║╚══╗╔══╗╔═╗╔╗╔╗╔══╗╔═╗║╚══╗║╔╗╔╗║║╚═╝║`,
          `╚══╗║║╔╗║║╔╝║╚╝║║╔╗║║╔╝╚══╗║║║║║║║║╔══╝`,
          `║╚═╝║║║═╣║║ ╚╗╔╝║║═╣║║ ║╚═╝║║║║║║║║║   `,
          `╚═══╝╚══╝╚╝  ╚╝ ╚══╝╚╝ ╚═══╝╚╝╚╝╚╝╚╝   `
        ].join('\n'),
        [
          '#C19C00',
          '#13A10E',
          '#0037DA',
          '#881798',
          '#C50F1F'
        ]
      )}\n${colors.bold(colors.fgGreen("Success!"))}`,
    }
  }));

  global.mongoStatus = true;

  require("../website/dashboard")(client);
});
