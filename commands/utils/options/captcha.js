const captchaSchema = require("../../../models/moderator/captcha");

module.exports = {
    name: "captcha",
    run: async (client, message, args) => {
        const options = args[1]?.toLowerCase();
        if (!["on", "off"].includes(options)) return message.reply("Invalid arguments");

        const captchaData = await captchaSchema.findOne({ Guild: message.guild.id });

        if (options === "on") {
            if (captchaData) return message.reply("Captcha is already on.");

            await captchaSchema.create({ Guild: message.guild.id });

            return message.channel.send("Turned on captcha feature");
        }

        if (options === "off") {
            if (!captchaData) return message.reply("Captcha is already off.");

            await captchaData.delete();

            return message.channel.send("Turned off captcha feature");
        }

    }
}