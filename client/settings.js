const { ActivityType } = require("discord.js");

module.exports = (config) => {

    const statusType = config.bot.status.type.toLowerCase();

    global.statusType = null;

    if (statusType === 'watching') global.statusType = ActivityType.Watching
    else if (statusType === 'listening') global.statusType = ActivityType.Listening;
    else if (statusType === 'playing') global.statusType = ActivityType.Playing;
    else if (statusType === 'streaming') global.statusType = ActivityType.Streaming;
    else if (statusType === 'competing') global.statusType = ActivityType.Competing;
    else if (statusType === 'custom') global.statusType = ActivityType.Custom;14

    return;

    if (!config.channel.ids.report.type) {
        console.error('Please provide a type for the report.');
        process.exit(1);
    } else if (!config.channel.ids.report.id) {
        console.error('Please provide a channel id for the report.');
        process.exit(1);
    } else if (!config.channel.ids.request.type) {
        console.error('Please provide a type for the request.');
        process.exit(1);
    } else if (!config.channel.ids.request.id) {
        console.error('Please provide a channel id for the request.');
        process.exit(1);
    } else if (!config.channel.ids.rankcard) {
        console.error('Please provide a channel id for the rankcard request.');
        process.exit(1);
    } else if (!config.channel.webhooks.status) {
        console.error('Please provide a channel id for the status.');
        process.exit(1);
    } else if (!config.channel.webhooks.cmdlog) {
        console.error('Please provide a channel id for the cmd log.');
        process.exit(1);
    } else if (!config.channel.webhooks.suggest) {
        console.error('Please provide a channel id for the suggestion.');
        process.exit(1);
    }

    if (!config.bot.status.text) {
        console.error("Please provide a status text for the bot.");
        process.exit(1);
    } else if (!config.bot.status.type) {
        console.error("Please provide a status type for the bot.");
        process.exit(1);
    } else if (!config.bot.bot.music) {
        console.error("Please provide a true or false if music cmds should be enabled or not for the bot.");
        process.exit(1);
    } else if (!config.bot.owner) {
        console.error("Please provide as many owner ids as you want.");
        process.exit(1);
    }

    if (!config.api.osu) {
        console.error("Please provide a osu api key or false.");
        process.exit(1);
    } else if (!config.api.chatbot) {
        console.error("please provide a chatbot api key or false.");
        process.exit(1);
    } else if (!config.api.fortnitetracker) {
        console.error("Please specify the fortnitetracker api key or false.");
        process.exit(1);
    }
}