const botSchema = require("../../models/logs/botStats");

module.exports = async (client) => {
    const cmdCount = client.commands.size + client.slashCommands.size;

    if (client.config.bot.database.mongo_extra) {
        const botStats = await botSchema.findOne({
            Account: client.user.id
        });

        if (!botStats) await botSchema.create({
            Account: client.user.id,
            Guilds: client.guilds.cache.size,
            Channels: client.channels.cache.size,
            Users: client.users.cache.size,
            Commands: cmdCount,
            CmdUsed: 0,
        });
        else {
            botStats.Guilds = client.guilds.cache.size;
            botStats.Channels = client.channels.cache.size;
            botStats.Users = client.users.cache.size;
            botStats.Commands = cmdCount;

            await botStats.save();
        }
    }
}