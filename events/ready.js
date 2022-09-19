const { EmbedBuilder, WebhookClient, PermissionsBitField, ActivityType } = require("discord.js");
const { blacklistedwords } = require('../client/collection');
const Schema = require('../models/moderator/blackwords');
const verFile = require('../version.json');
const client = require("../index");
const { table } = require('table');
const colors = require('colors');

client.on("ready", async() => {

  const cmdCount = String(Number(client.commands.size) + Number(client.slashCommands.size));

  const activityName = client.config.bot.status.text
    .replace(/{guildsCount}/g, client.guilds.cache.size)
    .replace(/{usersCount}/g, client.users.cache.size)
    .replace(/{channelsCount}/g, client.channels.cache.size)
    .replace(/{commandCount}/g, cmdCount)
    .replace(/{botVersion}/g, verFile.version)
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
    [`${colors.gray("Connected To")} ${colors.yellow(`${client.user.tag}`)}`],
    [`${colors.white("Watching")} ${colors.red(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`)} ${colors.white(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1 ? "Users + Bots," : "User,"}`)} ${colors.red(`${client.guilds.cache.size}`)} ${colors.white(`${client.guilds.cache.size > 1 ? "Servers." : "Server."}`)}`],
    [`${colors.white(`MongoDB:`)} ${global.mongoStatus} ${colors.white("||")} ${colors.white(`Prefix:` + colors.red(` ${client.config.bot.info.prefix}`))} ${colors.white("||")} ${colors.red(cmdCount)} ${colors.white(`Commands`)}`],
  ], {
    columnDefault: {
      width: 50,
    },
    header: {
      alignment: 'center',
      content: `${require('gradient-string')(['#C19C00', '#13A10E', '#0037DA', '#881798', '#C50F1F']).multiline([
        `╔═══╗                  ╔═══╗╔═╗╔═╗╔═══╗`,
        `║╔═╗║                  ║╔═╗║║║╚╝║║║╔═╗║`,
        `║╚══╗╔══╗╔═╗╔╗╔╗╔══╗╔═╗║╚══╗║╔╗╔╗║║╚═╝║`,
        `╚══╗║║╔╗║║╔╝║╚╝║║╔╗║║╔╝╚══╗║║║║║║║║╔══╝`,
        `║╚═╝║║║═╣║║ ╚╗╔╝║║═╣║║ ║╚═╝║║║║║║║║║   `,
        `╚═══╝╚══╝╚╝  ╚╝ ╚══╝╚╝ ╚═══╝╚╝╚╝╚╝╚╝   `
      ].join('\n'))}\n${colors.green.bold("Success!")}`,
    }
  }));

  global.mongoStatus = true;

  require("../website/dashboard")(client);
});
