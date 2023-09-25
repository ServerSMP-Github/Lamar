const Schema = require('../../models/logs/modlogs');
const { EmbedBuilder } = require('discord.js');
const client = require("../../index");

module.exports = async (oldVoice, newVoice) => {
    const data = await Schema.findOne({ Guild: newVoice.guild.id }).exec();
    if (!data) return;
    if (data.vsu === true) return;
    if (oldVoice.channel === newVoice.channel) return;
    if (oldVoice.channel === null) client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle("🎤 Voice Channel Join 🎤")
            .setColor("Green")
            .addFields(
                { name: "Member", value: newVoice.member.user.username },
                { name: "Channel", value: `<#${newVoice.channel.id}>` }
            )
            .setTimestamp()
        ]
    });
    else if (newVoice.channel === null) client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle("🎤 Voice Channel Leave 🎤")
            .setColor("Red")
            .addFields(
                { name: "Member", value: oldVoice.member.user.username },
                { name: "Channel", value: `<#${oldVoice.channel.id}>` }
            )
            .setTimestamp()
        ]
    });
    else client.channels.cache.get(data.Channel).send({
        embeds: [
            new EmbedBuilder()
            .setTitle("🎤 Voice Channel Switch 🎤")
            .setColor("Green")
            .addFields(
                { name: "Member", value: newVoice.member.user.username },
                { name: "Old Channel", value: `<#${oldVoice.channel.id}>` },
                { name: "New Channel", value: `<#${newVoice.channel.id}>` }
            )
            .setTimestamp()
        ]
    });
}