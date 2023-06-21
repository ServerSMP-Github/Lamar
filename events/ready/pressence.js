module.exports = async (client) => {
    const cmdCount = client.commands.size + client.slashCommands.size;

    const activityName = client.config.bot.status.text
        .replace(/{guildsCount}/g, client.guilds.cache.size)
        .replace(/{usersCount}/g, client.users.cache.size)
        .replace(/{channelsCount}/g, client.channels.cache.size)
        .replace(/{commandCount}/g, cmdCount)
        .replace(/{botVersion}/g, client.config.bot.info.version)
        .replace(/{botName}/g, client.user.username)
        .replace(/{botPrefix}/g, client.config.bot.info.prefix);

    global.statusName = activityName;

    client.user.setPresence({
        activities: [{
            name: activityName,
            type: global.statusType
        }],
        status: client.config.bot.status.status
    });
}