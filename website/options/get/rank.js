const rankSchema = require("../../../models/server/guild-rankcard");
const xpSchema = require("../../../models/server/xp");

module.exports = {
    name: "rank",
    run: async(req, res, client, guild, member) => {
        const xpSettings = {
            ping: false,
            web: false,
            rate: null,
            card: {
                progress: {
                    option: false,
                    color: ""
                },
                status: {
                    style: "normal"
                },
                background: {
                    option: false,
                    url: ""
                }
            }
        };

        const rankData = await rankSchema.findOne({ Guild: guild.id });
        const xpData = await xpSchema.findOne({ Guild: guild.id });

        if (rankData && xpData) {
            xpSettings.ping = xpData.Ping;
            xpSettings.web = xpData.WebUI;
            xpSettings.rate = xpData.Rate;
            xpSettings.card.progress.option = rankData.ProgressOption;
            xpSettings.card.progress.color = rankData.ProgressBar;
            xpSettings.card.status.style = rankData.StatusStyle == false ? "normal" : "circle";
            xpSettings.card.background.option = rankData.BackgroundOption;
            xpSettings.card.background.url = rankData.Background == "default" ? "" : rankData.Background;
        }

        return xpSettings;
    }
}