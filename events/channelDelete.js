const { Events } = require("discord.js");
const client = require('../index');

const { getFileList } = require("../assets/api/file");

client.on(Events.ChannelDelete, async(channel) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/channelDelete`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(channel));
});
