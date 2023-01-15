const { Events } = require("discord.js");
const client = require("../index");

client.on(Events.VoiceStateUpdate, (oldVoice, newVoice) => {
    if (!client.config.music.enabled) return;

    const player = client.poru.players.get(oldVoice.guild.id);
    if (!player) return;

    if (!newVoice.guild.members.me.voice.channel) player.destroy();
});