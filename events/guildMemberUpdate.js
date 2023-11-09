const { Events } = require("discord.js");
const client = require('../index');

const { getFileList } = require("../assets/api/file");

client.on(Events.GuildMemberUpdate, async(oldMember, newMember) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/guildMemberUpdate`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(oldMember, newMember));
});