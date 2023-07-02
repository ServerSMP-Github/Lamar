const { fetchLeaderboard, computeLeaderboard } = require("../../assets/api/xp");
const { Message, Client, EmbedBuilder } = require("discord.js");
const xpSchema = require("../../models/server/xp");

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    description: "Show who has the most xp/level on you're server.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const xpData = await xpSchema.findOne({ Guild: message.guild.id });
        if (!xpData) return message.reply("XP system is disabled on this server!");

        let lb = await fetchLeaderboard(message.guild.id);
        if (lb.length < 1) return reply("Nobody's in leaderboard yet.");

        lb = await computeLeaderboard(client, lb, true);
        lb = lb.map(e => `**${e.position}**. *${e.username}*\nLevel: \`${e.level}\`\nXP: \`${e.xp.toLocaleString()}\``);

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("**Leaderboard**:")
                .setDescription(`${lb.join("\n\n")}`)
                .setColor("Random")
            ]
        });
    }
}