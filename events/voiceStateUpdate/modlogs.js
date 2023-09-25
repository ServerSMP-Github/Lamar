const Schema = require('../../models/logs/modlogs');
const { EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async (oldVoice, newVoice) => {
    const data = await Schema.findOne({ Guild: newVoice.guild.id }).exec();
    if (!data) return;
    if (data.vsu === true) return;
    if (oldVoice.voice.channel === newVoice.voice.channel) return;
    if (oldVoice.voice.channel === null) client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle("🎤 Voice Channel Join 🎤")
            .setColor("Green")
            .addField("Member", `${newVoice.user.username}`)
            .addField("Channel", `${newVoice.voice.channel.name}`)
            .setTimestamp()
        ]
    });
    else if (newVoice.voice.channel === null) client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle("🎤 Voice Channel Leave 🎤")
            .setColor("Red")
            .addField("Member", `${oldVoice.user.username}`)
            .addField("Channel", `${oldVoice.voice.channel.name}`)
            .setTimestamp()
        ]
    });
    else client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle("🎤 Voice Channel Switch 🎤")
            .setColor("Green")
            .addField("Member", `${newVoice.user.username}`)
            .addField("Old Channel", `${oldVoice.voice.channel.name}`)
            .addField("New Channel", `${newVoice.voice.channel.name}`)
            .setTimestamp()
        ]
    });
}