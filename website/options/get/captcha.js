const captchaSchema = require("../../../models/moderator/captcha");

module.exports = {
    name: "captcha",
    run: async(req, res, client, guild, member) => {
        let captchaSettings = await captchaSchema.findOne({ Guild: guild.id });
        if (captchaSettings) captchaSettings = true;
        else captchaSettings = false;

        return captchaSettings;
    }
}