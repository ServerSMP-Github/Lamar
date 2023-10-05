const translateSchema = require("../../models/server/translate");
const translate = require("../../assets/api/language/translate");
const detect = require("../../assets/api/language/detect");
const client = require("../../index");

module.exports = async(message) => {
    if (!message.guild || message.author.bot) return;

    const msg = message.cleanContent;
    if (msg.length < client.config.language.length || !msg.includes(' ')) return;

    const translateData = await translateSchema.findOne({ Guild: message.guild.id });
    if (!translateData) return;

    const result = await detect({ client, message: msg });
    if (!result || result === undefined) return;
    if (result.accuracy * 100 < translateData.Percent) return;
    if (result.language === translateData.Language) return;

    const stringContent = String(message.content);

    const translated = await translate({ client, message: stringContent, language: translateData.Language });
    if (!translated || !translated.text || translated.iso === translateData.Language || translated.text.toLocaleLowerCase() === stringContent.toLocaleLowerCase()) return;

    message.reply({
        content: translated.text,
        allowedMentions: {
            repliedUser: false
        }
    });
}