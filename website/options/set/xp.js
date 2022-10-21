const rankSchema = require("../../../models/server/guild-rankcard");
const { isValidHexCode } = require("../assets/api/color");
const { isValidHttpUrl } = require("../assets/api/url");
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

    if (req.body?.category === "rank" && req.body["xp.card.status.style"]) {
      let colorOption = req.body["xp.card.progress.option"];
      let colorType = req.body["xp.card.progress.color"];

      let backgroundOption = req.body["xp.card.background.option"];
      let backgroundURL = req.body["xp.card.background.url"];

      let statusStyle = req.body["xp.card.status.style"];

      const check = ["true", "false"];

      if (check.includes(colorOption) === false) colorOption = "false";
      if (check.includes(backgroundOption) === false) backgroundOption = "false";

      if (colorOption === "false") colorType = "";
      if (backgroundOption === "false") backgroundURL = "";

      if (!isValidHexCode(colorType)) colorType = "";
      if (!isValidHttpUrl(backgroundURL)) backgroundURL = "";

      if (["normal", "circle"].includes(statusStyle) === false) statusStyle = "normal";

      const colorValue = colorOption == "true" ? true : false;
      const backgroundValue = backgroundOption == "true" ? true : false;
      const backgroundUrlValue = backgroundURL ? backgroundURL : "default";
      const statusValue = statusStyle == "normal" ? false : true;

      const rankData = await rankSchema.findOne({ Guild: guild.id });

      if (colorValue !== false || colorType !== "" || backgroundValue !== false || backgroundURL !== "" || statusValue !== false) {
        if (!rankData) {
          await rankSchema.create({
            Guild: guild.id,
            ProgressOption: colorValue,
            ProgressBar: colorType,
            StatusStyle: statusValue,
            BackgroundOption: backgroundValue,
            Background: backgroundUrlValue,
          });

          await xpSchema.create({
            Guild: guild.id,
            Guild: guild.id,
            Channel: "false",
            Ping: false,
            WebUI: true,
            Rate: 6,
          });
        } else {
          rankData.ProgressOption = colorValue,
          rankData.ProgressBar = colorType,
          rankData.StatusStyle = statusValue,
          rankData.BackgroundOption = backgroundValue,
          rankData.Background = backgroundUrlValue,

          await rankData.save();
        }

        xpSettings.card.progress.option = colorValue;
        xpSettings.card.progress.color = colorType;
        xpSettings.card.status.style = statusStyle;
        xpSettings.card.background.option = backgroundValue;
        xpSettings.card.background.url = backgroundURL;
      } else rankData ? await rankData.delete() : null;
    }

    return xpSettings;
  }
}