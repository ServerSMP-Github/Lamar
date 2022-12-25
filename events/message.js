const { Events } = require("discord.js");
const client = require('../index');

const { getFileList } = require("../assets/api/file");

client.on(Events.MessageCreate, async(message) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/messageCreate`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(message));
});