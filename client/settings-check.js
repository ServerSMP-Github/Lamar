module.exports = (setting) => {
    return;

    if (!setting.channel.ids.report.type) {
        console.error('Please provide a type for the report.');
        process.exit(1);
    } else if (!setting.channel.ids.report.id) {
        console.error('Please provide a channel id for the report.');
        process.exit(1);
    } else if (!setting.channel.ids.request.type) {
        console.error('Please provide a type for the request.');
        process.exit(1);
    } else if (!setting.channel.ids.request.id) {
        console.error('Please provide a channel id for the request.');
        process.exit(1);
    } else if (!setting.channel.ids.rankcard) {
        console.error('Please provide a channel id for the rankcard request.');
        process.exit(1);
    } else if (!setting.channel.webhooks.status) {
        console.error('Please provide a channel id for the status.');
        process.exit(1);
    } else if (!setting.channel.webhooks.cmdlog) {
        console.error('Please provide a channel id for the cmd log.');
        process.exit(1);
    } else if (!setting.channel.webhooks.suggest) {
        console.error('Please provide a channel id for the suggestion.');
        process.exit(1);
    }

    if (!setting.bot.status.text) {
        console.error("Please provide a status text for the bot.");
        process.exit(1);
    } else if (!setting.bot.status.type) {
        console.error("Please provide a status type for the bot.");
        process.exit(1);
    } else if (!setting.bot.bot.music) {
        console.error("Please provide a true or false if music cmds should be enabled or not for the bot.");
        process.exit(1);
    } else if (!setting.bot.owner) {
        console.error("Please provide as many owner ids as you want.");
        process.exit(1);
    }

    if (!setting.api.osu) {
        console.error("Please provide a osu api key or false.");
        process.exit(1);
    } else if (!setting.api.chatbot) {
        console.error("please provide a chatbot api key or false.");
        process.exit(1);
    } else if (!setting.api.fortnitetracker) {
        console.error("Please specify the fortnitetracker api key or false.");
        process.exit(1);
    }
}