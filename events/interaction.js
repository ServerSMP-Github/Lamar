const client = require("../index");

const { getFileList } = require("../assets/api/file");

client.on("interactionCreate", async (interaction) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/interactionCreate`, { type: ".js", recursively: true });
    eventFiles.map((value) => require(value)(interaction));
});
