const xpSchema = require("../../models/server/xp");
const client = require("../../index");
const Levels = require('discord-xp');

module.exports = async(message) => {
    if (!message.guild || message.author.bot) return;

    const xpData = await xpSchema.findOne({ Guild: message.guild.id });

    if (!xpData) return;

    const randomXp = Math.floor(Math.random() * Number(xpData.Rate)) + 1;
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);

    if (!hasLeveledUp) return;

    const channel = xpData.Channel !== "false" ? xpData.Channel == "none" ? null : message.guild.channels.cache.get(xpData.Channel) : message.channel;
    const ping = xpData.Ping == false ? message.author.username : message.author;

    const user = await Levels.fetch(message.author.id, message.guild.id);

    channel.send({ content: `${ping} leveled up to ${user.level}! Keep it going!` });
} 