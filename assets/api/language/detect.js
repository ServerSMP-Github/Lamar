const { detectAll } = require("tinyld");

module.exports = async function({ client, message }) {

    let detected = null;

    const server = client.config.language.detect;

    if (server.type === "local") {
        detected = detectAll(message);

        if (!detected[0].lang) return;

        detected = {
            accuracy: detected[0].accuracy,
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
            accuracy: detected.language,
            language: 1
        };
    }

    return detected;

}