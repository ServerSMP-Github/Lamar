const { Events } = require("discord.js");
const client = require("../index");

const { getFileList } = require("../assets/api/file");

client.once(Events.ClientReady, async() => {
  const eventFiles = await getFileList(`${process.cwd()}/events/ready`, { type: ".js", recursively: true });
  eventFiles.map((value) => require(value)(client));
});
