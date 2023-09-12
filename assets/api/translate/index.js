const translate = require("@iamtraction/google-translate");

module.exports = async function({ client, message, language }) {

    let translated = null;

    const server = client.config.translate;

    if (server.type === "google") {
        translated = await translate(message, {
            from: 'auto',
            to: language
        });

        if (!translated.text) return;

        translated = {
            text: translated.text,
            iso: translated.from.language.iso
        };
    } else if (server.type === "libre") {
        translated = await (await fetch(`${server.url}/translate`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: message,
                source: "auto",
                target: language,
                api_key: server.key
            })
        })).json();

        if (!translated.translatedText) return;

        translated = {
            text: translated.translatedText,
            iso: translated.detectedLanguage.language
        };
    } else if (server.type === "easynmt") {
        translated = await (await fetch(`${server.url}/translate?target_lang=${language}&text=${message}`)).json();

        if (!translated.translated[0]) return;

        translated = {
            text: translated.translated[0],
            iso: translated.detected_langs[0]
        };
    }

    return translated;

}