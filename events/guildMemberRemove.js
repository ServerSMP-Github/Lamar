const client = require('../index');

const { getFileList } = require("../assets/api/file");

client.on("guildMemberRemove", async(member) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/guildMemberRemove`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(member));
});