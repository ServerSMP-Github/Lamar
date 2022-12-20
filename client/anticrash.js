const { EmbedBuilder, WebhookClient } = require("discord.js");
const colors = require('../assets/api/console');
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'antiCrashLog.log'
    }),
  ],
  format: winston.format.printf(log => `[${log.level.toLowerCase()}] - ${log.message}`),
});

module.exports = (client) => {
  const loggerHook = new WebhookClient({ url: client.config.channel.webhooks.error });

  process.on('unhandledRejection', (reason, p) => {
    logger.error(colors.fgBlue('[antiCrash.js]') + colors.fgRed(' Unhandled rejection/crash detected.'));
    logger.error(reason, p);

    loggerHook.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Unhandled Rejection`)
        .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
        .addFields([
          { name: "Promise", value: `\`\`\`${p}\`\`\``, inline: true },
          { name: "Reason", value: `\`\`\`${reason}\`\`\``, inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: "Imagine a bot without anti-crash" })
        .setColor("Red")
      ]
    });
  });

  process.on("uncaughtException", (err, origin) => {
    logger.error(colors.fgBlue('[antiCrash.js]') + colors.fgRed(' Uncaught exception/catch detected.'));
    logger.error(err, origin);

    loggerHook.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Uncaught Exception`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
        .addFields([
          { name: "Origin", value: `\`\`\`${origin}\`\`\``, inline: true },
          { name: "Error", value: `\`\`\`${err}\`\`\``, inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: "Imagine a bot without anti-crash" })
        .setColor("Red")
      ]
    });
  });

  process.on('uncaughtExceptionMonitor', (err, origin) => {
    logger.error(colors.fgBlue('[antiCrash.js]') + colors.fgRed(' Uncaught exception/catch detected. (Monitor)'));
    logger.error(err, origin);

    loggerHook.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Uncaught Exception Monitor`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
        .addFields([
          { name: "Origin", value: `\`\`\`${origin}\`\`\``, inline: true },
          { name: "Error", value: `\`\`\`${err}\`\`\``, inline: true }
        ])
        .setTimestamp()
        .setFooter({ text: "Imagine a bot without anti-crash" })
        .setColor("Red")
      ]
    });
  });

  process.on('multipleResolves', (type, promise, reason) => { return });
};
