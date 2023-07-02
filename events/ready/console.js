const { EmbedBuilder, WebhookClient } = require("discord.js");
const colors = require('../../assets/api/console');
const { table } = require('table');

module.exports = async (client) => {
    const cmdCount = client.commands.size + client.slashCommands.size;

    if (client.config.channel.webhooks.status) new WebhookClient({
        url: client.config.channel.webhooks.status
    }).send({
        embeds: [
            new EmbedBuilder()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`:green_circle: Success!\n:robot: Connected To **${client.user.username}**\n:eyes: Watching \`${client.users.cache.size}\` Users, \`${client.guilds.cache.size}\` Servers.\n:information_source: Prefix: \`${client.config.bot.info.prefix}\` || \`${cmdCount}\` Commands`)
            .setColor("Random")
            .setTimestamp()
        ]
    });

    global.startSpinner.succeed();

    console.log(table([
        [`${colors.fgGray("Connected To")} ${colors.fgYellow(`${client.user.username}`)}`],
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

    if (client.config.music.enabled && client.config.music.server.enabled) console.log(global.lavalinkServer.success ? global.lavalinkServer.success : global.lavalinkServer.error);
    global.lavalinkServer.check = true;
}