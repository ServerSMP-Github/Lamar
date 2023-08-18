const { Client, Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { DMY } = require("../../assets/api/time/index");

module.exports = {
    name: "roleinfo",
    description: "Get information of a role",
    usage: "[ @role ]",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        try {
            const role = message.mentions.roles.first();
            if (!role) return message.reply("Please specify a role!");

            const permissions = {
                "CreateInstantInvite": "Create Instant Invite",
                "KickMembers": "Kick Members",
                "BanMembers": "Ban Members",
                "Administrator": "Administrator",
                "ManageChannels": "Manage Channels",
                "ManageGuild": "Manage Guild",
                "AddReactions": "Add Reactions",
                "ViewAuditLog": "View Audit Log",
                "PrioritySpeaker": "Priority Speaker",
                "Stream": "Stream",
                "ViewChannel": "View Channel",
                "SendMessages": "Send Messages",
                "SendTTSMessages": "Send TTS Messages",
                "ManageMessages": "Manage Messages",
                "EmbedLinks": "Embed Links",
                "AttachFiles": "Attach Files",
                "ReadMessageHistory": "Read Message History",
                "MentionEveryone": "Mention Everyone",
                "UseExternalEmojis": "Use External Emojis",
                "ViewGuildInsights": "View Guild Insights",
                "Connect": "Connect",
                "Speak": "Speak",
                "MuteMembers": "Mute Members",
                "DeafenMembers": "Deafen Members",
                "MoveMembers": "Move Members",
                "UseVAD": "Use VAD (Voice Activity Detection)",
                "ChangeNickname": "Change Nickname",
                "ManageNicknames": "Manage Nicknames",
                "ManageRoles": "Manage Roles",
                "ManageWebhooks": "Manage Webhooks",
                "ManageEmojisAndStickers": "Manage Emojis and Stickers",
                "ManageGuildExpressions": "Manage Guild Expressions",
                "UseApplicationCommands": "Use Application Commands",
                "RequestToSpeak": "Request To Speak",
                "ManageEvents": "Manage Events",
                "ManageThreads": "Manage Threads",
                "CreatePublicThreads": "Create Public Threads",
                "CreatePrivateThreads": "Create Private Threads",
                "UseExternalStickers": "Use External Stickers",
                "SendMessagesInThreads": "Send Messages in Threads",
                "UseEmbeddedActivities": "Use Embedded Activities",
                "ModerateMembers": "Moderate Members",
                "ViewCreatorMonetizationAnalytics": "View Creator Monetization Analytics",
                "UseSoundboard": "Use Soundboard",
                "UseExternalSounds": "Use External Sounds",
                "SendVoiceMessages": "Send Voice Messages"
            };

            const yesno = { true: '`Yes`', false: '`No`' };

            const rolePermissions = role.permissions.toArray();
            const finalPermissions = [];

            for (const permission in permissions) {
                rolePermissions.includes(permission) ? finalPermissions.push(`✔️ ${permissions[permission]}`) : finalPermissions.push(`❌ ${permissions[permission]}`);
            }

            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`Role Info !!`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                    .addFields([
                        {
                            name: "Name",
                            value: `<@&${role.id}>`,
                            inline: true
                        },
                        {
                            name: "ID",
                            value: `\`${role.id}\``,
                            inline: true
                        },
                        {
                            name: "Position",
                            value: `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``,
                            inline: true
                        },
                        {
                            name: "Mentionable",
                            value: yesno[role.mentionable],
                            inline: true
                        },
                        {
                            name: "Bot Role",
                            value: yesno[role.managed],
                            inline: true
                        },
                        {
                            name: "Visible",
                            value: yesno[role.hoist],
                            inline: true
                        },
                        {
                            name: "Color",
                            value: `\`${role.hexColor.toUpperCase()}\``,
                            inline: true
                        },
                        {
                            name: "Creation Date",
                            value: `\`${DMY(role.createdAt)}\``,
                            inline: true
                        },
                        {
                            name: "Permissions Date",
                            value: `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``,
                            inline: false
                        },
                    ])
                ]
            });
        } catch (error) {
            await message.reply({ content: error.message });
        }
    },
};