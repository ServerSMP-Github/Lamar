const captchaSchema = require('../../models/moderator/captcha');
const client = require("../../index");

module.exports = async(guild) => {
    const captchaData = await captchaSchema.findOne({ Guild: guild.id });

    if (captchaData) await captchaData.delete();
}