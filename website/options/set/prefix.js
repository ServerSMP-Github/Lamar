const prefixSchema = require("../../../models/server/prefix");

module.exports = {
    name: "prefix",
    run: async(req, res, client, guild, member) => {
        let prefixChange = req.body.prefix;

        if (req.body?.category === "general" && prefixChange && !prefixChange.match(/^(?:<@!?)?(\d{16,22})>/gi) || !prefixChange.match(/^(?:<#?)?(\d{16,22})>$/gi) || !prefixChange.match(/^(?:<:(?![\n])[()#$@-\w]+:?)?(\d{16,22})>$/gi)) {
            const prefixSettings = await prefixSchema.findOne({ Guild: guild.id });
            if (prefixSettings) {
                prefixSettings.Prefix = req.body.prefix;
                await prefixSettings.save();
            } else await prefixSchema.create({
                Guild: guild.id,
                Prefix: req.body.prefix
            });
        } else prefixChange = client.config.bot.info.prefix;

        return prefixChange;
    }
}