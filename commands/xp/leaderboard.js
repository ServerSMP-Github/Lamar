const { Message, Client, EmbedBuilder } = require("discord.js");
const xpSchema = require("../../models/server/xp");
const Levels = require('discord-xp');

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
        xpSchema.findOne({ Guild: message.guild.id }, async(err, data) => {
            if (err) return console.error(err);
            if (!data) return message.reply("XP system is disabled on this server!");
            if (data) {
                const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
                if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");
                const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
                const lb = leaderboard.map(e => `**${e.position}**. *${e.username}#${e.discriminator}*\nLevel: \`${e.level}\`\nXP: \`${e.xp.toLocaleString()}\``);
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("**Leaderboard**:")
                        .setDescription(`${lb.join("\n\n")}`)
                        .setColor("Random")
                    ]
                });
            }
        });
    },
};