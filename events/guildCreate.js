const { Events } = require("discord.js");
const client = require('../index');

const { getFileList } = require("../assets/api/file");

client.on(Events.GuildCreate, async(guild) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/guildCreate`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(guild));
});
