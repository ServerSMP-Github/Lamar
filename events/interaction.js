const { Events } = require("discord.js");
const client = require("../index");

const { getFileList } = require("../assets/api/file");

client.on(Events.InteractionCreate, async (interaction) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/interactionCreate`, { type: ".js", recursively: true });
    eventFiles.map((value) => require(value)(interaction));
});
