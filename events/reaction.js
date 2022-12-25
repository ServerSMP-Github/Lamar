const reactionSchema = require("../models/logs/reaction-roles");
const { Events } = require("discord.js");
const client = require("../index");

client.on(Events.MessageReactionAdd, async(reaction, user) => {
    if (reaction.partial) await reaction.fetch();

    const reactionData = await reactionSchema.findOne({ Message: reaction.message.id });
    if (!reactionData) return;

    for (let index = 0; index < reactionData.Roles.length; index++) {
        const element = reactionData.Roles[index];

        if (element.emoji === reaction.emoji.id || element.emoji === reaction.emoji.name) {
            const member = reaction.message.guild.members.cache.get(user.id);
            if (!member.roles.cache.has(element.role)) member.roles.add(element.role);
        }
    }
});

client.on("messageReactionRemove", async(reaction, user) => {
    if (reaction.partial) await reaction.fetch();

    const reactionData = await reactionSchema.findOne({ Message: reaction.message.id });
    if (!reactionData) return;

    for (let index = 0; index < reactionData.Roles.length; index++) {
        const element = reactionData.Roles[index];

        if (element.emoji === reaction.emoji.id || element.emoji === reaction.emoji.name) {
            const member = reaction.message.guild.members.cache.get(user.id);
            if (member.roles.cache.has(element.role)) member.roles.remove(element.role);
        }
    }
});