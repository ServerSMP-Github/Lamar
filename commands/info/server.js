const { Message, Client, EmbedBuilder, ChannelType } = require("discord.js");
const { toTimestamp } = require('../../assets/api/time/index');

module.exports = {
    name: "server",
    aliases: ['serverinfo'],
    description: "Retrieve information about the server you are in.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const roleColor = message.guild.members.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.members.me.displayHexColor;

        const verificationLevels = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: '💢',
            4: '💥'
        };

        const owner = await message.guild.fetchOwner();
        const members = message.guild.members.cache;

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle(message.guild.name)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setColor(roleColor)
                .addFields([
                    {
                        name: "General Info",
                        value: [
                            `- ⚙️ ID: \`${message.guild.id}\``,
                            `- 🗂️ Name: \`${message.guild.name}\``,
                            `- 🎩 Owner: \`${owner.user.username}\``,
                            `- 🖼️ Icon: [link](${message.guild.iconURL()})`,
                        ].join('\n')
                    },
                    {
                        name: "Counts",
                        value: [
                            `- 👋 Members: \`${message.guild.memberCount}\` (🤖 Bots: \`${members.filter(member => member.user.bot).size}\` | 👨 Humans: \`${members.filter(member => !member.user.bot).size}\`)`,
                            `- ✨ Roles: \`${message.guild.roles.cache.size} roles\``,
                            `- 📝 Channels: \`${message.guild.channels.cache.size} total\` (💬 Text: \`${message.guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).size}\` | 🎤 Voice: \`${message.guild.channels.cache.filter(ch => ch.type === ChannelType.GuildVoice).size}\`)`,
                            `- 😑 Emojis: \`${message.guild.emojis.cache.size} total\` (😊 Standard: \`${message.guild.emojis.cache.filter(emoji => !emoji.animated).size}\` | 🥰 Animated: \`${message.guild.emojis.cache.filter(emoji => emoji.animated).size}\`)`,
                        ].join('\n')
                    },
                    {
                        name: "Additional Info",
                        value: [
                            `- 🕐 Time Created: ${toTimestamp(message.guild.createdTimestamp)}`,
                            `- 🌎 Region: \`${message.guild.region}\``,
                            `- 💸 Boost Tier: \`${message.guild.premiumTier ? `Tier : ${message.guild.premiumTier}` : 'None'}\``,
                            `- 💰 Boost Count: \`${message.guild.premiumSubscriptionCount || '0'}\``,
                            `- 🛏️ AFK Channel: \`${message.guild.afkChannel ? message.guild.afkChannel.name : 'None'}\``,
                            `- 💤 AFK Timeout: \`${message.guild.afkTimeout / 60} minutes\``,
                            `- 📱 Verification Level: \`${verificationLevels[message.guild.verificationLevel]}\``,
                            `- 🔞 Explicit Content Filter: \`${message.guild.explicitContentFilter}\``,
                            `- 🏓 Default Message Notification: \`${message.guild.defaultMessageNotifications}\``,
                            `- 🔥 MFA Level: \`${message.guild.mfaLevel}\``,
                        ].join('\n')
                    }
                ])
                .setTimestamp()
            ]
        });
    },
};
