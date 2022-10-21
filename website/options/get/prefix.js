const prefixSchema = require("../../../models/server/prefix");

module.exports = {
    name: "prefix",
    run: async(req, res, client, guild, member) => {
        let prefixSettings = await prefixSchema.findOne({ Guild: guild.id });
        if (prefixSettings) prefixSettings = prefixSettings.Prefix;
        else prefixSettings = client.config.bot.info.prefix;

        return prefixSettings;
    }
}