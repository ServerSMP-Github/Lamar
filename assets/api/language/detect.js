const { detectAll } = require("tinyld");

module.exports = async function({ client, message }) {

    let detected = null;

    const server = client.config.language.detect;

    if (server.type === "local") {
        detected = detectAll(message);

        if (!detected[0].lang) return;

        detected = {
            accuracy: detected[0].accuracy * 100,
            language: detected[0].lang
        };
    } else if (server.type === "remote") {
        detected = await (await fetch(`${server.url}/`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message
            })
        })).json();

        if (!detected.language) return;

        detected = {
            accuracy: 100,
            language: detected.language
        };
    } else if (server.type === "libre") {
        detected = await (await fetch(`${server.url}/detect`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: message,
                api_key: server.key
            })
        })).json();

        if (!detected[0].language) return;

        detected = {
            accuracy: detected[0].confidence,
            language: detected[0].language
        };
    } 

    return detected;

}