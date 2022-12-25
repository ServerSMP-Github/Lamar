const { Events } = require("discord.js");
const client = require('../index');

const { getFileList } = require("../assets/api/file");

client.on(Events.GuildMemberAdd, async(member) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/guildMemberAdd`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(member));
});