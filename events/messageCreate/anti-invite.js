const antiSchema = require("../../models/moderator/anti-invite.js");
const client = require("../../index");

module.exports = async(message) => {
    if (!message.guild) return;

    const antiData = await antiSchema.findOne({ Guild: message.guild.id });

    if (!antiData) return;

    function deleteMessage() {
        message.delete();
        if (antiData.Message === true) message.channel.send("No advertising in this server.");
    }

    const links = ['discord.gg/', 'discordapp.com/invite', 'discord.com/invite'];

    for (const link of links) {
        if (!message.content.includes(link)) return;

        const code = message.content.split(link)[1].split(' ')[0];
        const isGuildInvite = message.gui.invites.cache.has(code);

        if (!isGuildInvite) {
            try {
                const vanity = await message.guild.fetchVanityData();

                if (code !== vanity?.code) return deleteMessage();

            } catch (err) {
                deleteMessage();
            }
        }

    }
}