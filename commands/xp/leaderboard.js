const { fetchLeaderboard, computeLeaderboard, xpFor } = require("../../assets/api/xp");
const { generateLeaderboard } = require("../../assets/api/canvas/leaderboard");
const { Message, Client, AttachmentBuilder } = require("discord.js");
const guildRankcard = require("../../models/server/guild-rankcard");
const userRankcard = require("../../models/user/user-rankcard");
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

        const guildCardData = await guildRankcard.findOne({ Guild: message.guild.id });

        lb = await computeLeaderboard(client, lb, true);
        lb = await Promise.all(lb.map(async(user) => {
            const userCardData = await userRankcard.findOne({ User: user.userID });

            const progressColor = userCardData?.ProgressBar ? userCardData.ProgressBar : guildCardData?.ProgressBar ? guildCardData.ProgressBar : "#ffffff";
            const avatar = client.users.cache.get(user.userID).displayAvatarURL({ extension: 'png' });

            const requiredXP = (xpFor(user.level + 1) - (user.level * user.level * 100));
            const currentXP = (user.xp - (user.level * user.level * 100));

            return {
                guild: user.guildID,
                user: user.userID,
                currentXP: currentXP,
                requiredXP: requiredXP,
                level: user.level,
                position: user.position,
                username: user.username,
                avatar: avatar,
                progressBar: progressColor || "#ffffff"
            }
        }));

        lb = await generateLeaderboard(lb);

        return message.channel.send({
            files: [
                new AttachmentBuilder(lb, { name: "lb.png" })
            ]
        });
    }
}