const translateSchema = require("../../models/server/translate.js");
const client = require("../../index");
const axios = require("axios");

module.exports = async(message) => {
    if (!message.guild || message.author.bot) return;

    const msg = message.cleanContent;

    if (msg.length < 6 || !msg.includes(' ')) return;

    const translateData = await translateSchema.findOne({ Guild: message.guild.id });

    if (!translateData) return;

    const result = (await axios.post(`${client.config.translate.url}/detect`, {
        q: String(msg),
        api_key: client.config.translate.key
    })).data[0];

    if (!result || result === undefined) return;
    if (result.confidence < translateData.Percent) return;
    if (result.language === translateData.Language) return;

    const stringContent = String(message.content);

    const translated = (await axios.post(`${client.config.translate.url}/translate`, {
        q: stringContent,
        source: "auto",
        target: translateData.Language,
        api_key: client.config.translate.key
    })).data;

    if (!translated.translatedText) return;

    if (translated.detectedLanguage.translated == "en" || translated.translatedText.toLocaleLowerCase() == stringContent.toLocaleLowerCase()) return;

    message.reply({
        content: translated.translatedText,
        allowedMentions: {
            repliedUser: false
        }
    });
}