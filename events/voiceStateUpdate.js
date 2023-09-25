const { Events } = require("discord.js");
const client = require("../index");

const { getFileList } = require("../assets/api/file");

client.on(Events.VoiceStateUpdate, async(oldVoice, newVoice) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/voiceStateUpdate`, { type: ".js", recursively: false });
    eventFiles.map((value) => require(value)(oldVoice, newVoice));
});