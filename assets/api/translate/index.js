const translate = require("@iamtraction/google-translate");

module.exports = async function({ client, message }) {

    let translated = "error?";

    if (client.config.translate.type === "google") translated = (await translate(message, { from: "auto", to: "en" })).text;
    else if (client.config.translate.type === "libre") translated = (await (await fetch(`${client.config.translate.url}/translate`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: message,
            source: "auto",
            target: "en",
            api_key: client.config.translate.key
        })
    })).json()).translatedText;

    return translated;

}