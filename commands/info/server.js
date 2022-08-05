const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder } = require("discord.js");
const { serverDate, fromNow } = require('../../assets/api/time/index');

module.exports = {
    name: "server",
    aliases: ['serverinfo'],
    description: "Give's info on the server that you are on.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        const verificationLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '💢',
            VERY_HIGH: '💥'
        };

        const owner = await message.guild.fetchOwner();
        const members = message.guild.members.cache;

        const embed = new EmbedBuilder()
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setColor(roleColor)
            .addField('General Info', [
                `⚙️ ID: \`${message.guild.id}\``,
                `🗂️ Name: \`${message.guild.name}\``,
                `🎩 Owner: \`${owner.user.tag}\``,
                `🖼️ Icon: [link](${message.guild.iconURL()})`,
            ].join('\n'))
            .addField('Counts', [
                `👋 Members: \`${message.guild.memberCount}\` (🤖 Bots: \`${members.filter(member => member.user.bot).size}\` | 👨 Humans: \`${members.filter(member => !member.user.bot).size}\`)`,
                `✨ Roles: \`${message.guild.roles.cache.size} roles\``,
                `📝 Channels: \`${message.guild.channels.cache.size} total\` (💬 Text: \`${message.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size}\` | 🎤 Voice: \`${message.guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size}\`)`,
                `😑 Emojis: \`${message.guild.emojis.cache.size} total\` (😊 Standard: \`${message.guild.emojis.cache.filter(emoji => !emoji.animated).size}\` | 🥰 Animated: \`${message.guild.emojis.cache.filter(emoji => emoji.animated).size}\`)`,
            ].join('\n'))
            .addField("Additional Info", [
                `🕐 Time Created: \`${serverDate(message.guild.createdTimestamp)} [${fromNow(message.guild.createdTimestamp)}]\``,
                `🌎 Region: \`${message.guild.region}\``,
                `💸 Boost Tier: \`${message.guild.premiumTier ? `Tier : ${message.guild.premiumTier}` : 'None'}\``,
                `💰 Boost Count: \`${message.guild.premiumSubscriptionCount || '0'}\``,
                `🛏️ AFK Channel: \`${message.guild.afkChannel ? message.guild.afkChannel.name : 'None'}\``,
                `💤 AFK Timeout: \`${message.guild.afkTimeout / 60} minutes\``,
                `📱 Verification Level: \`${verificationLevels[message.guild.verificationLevel]}\``,
                `🔞 Explicit Content Filter: \`${message.guild.explicitContentFilter}\``,
                `🏓 Default Message Notification: \`${message.guild.defaultMessageNotifications}\``,
                `🔥 MFA Level: \`${message.guild.mfaLevel}\``,
            ].join('\n'))
            .setTimestamp();

            message.channel.send({ embeds: [embed] });
    },
};
