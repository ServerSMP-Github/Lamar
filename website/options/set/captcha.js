const captchaSchema = require("../../../models/moderator/captcha");

module.exports = {
    name: "captcha",
    run: async(req, res, client, guild, member) => {
        let captchaChange = req.body.captcha;

        if (req.body?.category === "moderation" && captchaChange) {
            const captchaSettings = await captchaSchema.findOne({ Guild: guild.id });

            if (captchaChange === "true") {
                if (!captchaSettings) await captchaSchema.create({
                    Guild: guild.id
                });

                captchaChange = "true";
            }

            if (captchaChange === "false") {
                if (captchaSettings) await captchaSettings.delete();

                captchaChange = "false";
            }
        }

        return captchaChange;
    }
}