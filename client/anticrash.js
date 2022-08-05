const chalk = require('chalk');
const winston = require('winston');
const { EmbedBuilder, WebhookClient } = require("discord.js")

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
    logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red(' Unhandled rejection/crash detected.'));
    logger.error(reason, p);

    loggerHook.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Unhandled Rejection`)
        .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
        .addField("Promise", `\`\`\`${p}\`\`\``, true)
        .addField("Reason", `\`\`\`${reason}\`\`\``, true)
        .setTimestamp()
        .setFooter({ text: "Imagine a bot without anti-crash" })
        .setColor("RED")
      ]
    });
  });
  process.on("uncaughtException", (err, origin) => {
    logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red(' Uncaught exception/catch detected.'));
    logger.error(err, origin);

    loggerHook.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Uncaught Exception`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
        .addField("Origin", `\`\`\`${origin}\`\`\``, true)
        .addField("Error", `\`\`\`${err}\`\`\``, true)
        .setTimestamp()
        .setFooter({ text: "Imagine a bot without anti-crash" })
        .setColor("RED")
      ]
    });
  });
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red(' Uncaught exception/catch detected. (Monitor)'));
    logger.error(err, origin);

    loggerHook.send({
      username: client.user.username,
      avatarURL: client.user.displayAvatarURL(),
      embeds: [new EmbedBuilder()
        .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`Uncaught Exception Monitor`)
        .setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
        .addField("Origin", `\`\`\`${origin}\`\`\``, true)
        .addField("Error", `\`\`\`${err}\`\`\``, true)
        .setTimestamp()
        .setFooter({ text: "Imagine a bot without anti-crash" })
        .setColor("RED")
      ]
    });
  });
  process.on('multipleResolves', (type, promise, reason) => {
    logger.error(chalk.blueBright('[antiCrash.js]') + chalk.red(' Multiple resolves detected.'));
    logger.error(type, promise, reason);

    // loggerHook.send({
    //   username: client.user.username,
    //   avatarURL: client.user.displayAvatarURL(),
    //   embeds: [new EmbedBuilder()
    //     .setAuthor({ name: `Anti Crash`, iconURI: client.user.displayAvatarURL({ dynamic: true }) })
    //     .setTitle(`Multiple Resolves`)
    //     .setURL("https://nodejs.org/api/process.html#event-multipleresolves")
    //     .addField("Type", `\`\`\`${type}\`\`\``, false)
    //     .addField("Promise", `\`\`\`${promise}\`\`\``, true)
    //     .addField("Reason", `\`\`\`${reason}\`\`\``, true)
    //     .setTimestamp()
    //     .setFooter({ text: "Imagine a bot without anti-crash" })
    //     .setColor("RED")
    //   ]
    // });
  });
};
