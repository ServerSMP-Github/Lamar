const translateSchema = require("../../models/server/translate.js");
const translate = require("@iamtraction/google-translate");
const client = require("../../index");
const axios = require("axios");
const cld = require('cld');

module.exports = async(message) => {
    if (!message.guild || message.author.bot) return;

    const msg = message.cleanContent;

    if (msg.length < 6 || !msg.includes(' ')) return;

    const translateData = await translateSchema.findOne({ Guild: message.guild.id });

    if (!translateData) return;

    const result = await cld.detect(String(msg)).catch(err => { return; });

    if (!result || result === undefined) return;
    if (result.languages[0].percent < translateData.Percent) return;
    if (result.languages[0].code === translateData.Language) return;

    const stringContent = String(message.content);

    let translated = null;

    if (client.config.translate.type === "google") {
        translated = await translate(stringContent, {
            from: 'auto',
            to: translateData.Language
        });

        if (!translated.text) return;

        translated = {
            text: translated.text,
            iso: translated.from.language.iso
        };
    } else if (client.config.translate.type === "libre") {
        translated = (await axios.post(`${client.config.translate.url}/translate`, {
            q: stringContent,
            source: "auto",
            target: translateData.Language
        })).data;

        if (!translated.translatedText) return;

        translated = {
            text: translated.translatedText,
            iso: translated.detectedLanguage.translated
        };
    }

    if (translated.iso == "en" || translated.text.toLocaleLowerCase() == stringContent.toLocaleLowerCase()) return;

    message.reply({
        content: translated.text,
        allowedMentions: {
            repliedUser: false
        }
    });
}