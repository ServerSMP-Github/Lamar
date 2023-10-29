const { capitalizeFirstLetter, boostLevel } = require('../../assets/api/member');
const { formatedDate, HMS } = require('../../assets/api/time/index');
const { Message, Client, EmbedBuilder } = require("discord.js");
const emojiList = require('../../assets/api/member/emoji.json');

module.exports = {
    name: "memberinfo",
    usage: '[ @user? ]',
    aliases: ['userinfo', 'who'],
    description: "Show's info of you or mention user.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const status = member.presence?.status ? emojiList.status[member.presence.status] : "⚫";

        const badge = member.user.flags.toArray();

        const flagToEmoji = {
            Staff: client.config.emoji.badges.staff,
            Partner: client.config.emoji.badges.partner,
            Hypesquad: client.config.emoji.badges.hypesquad_events,
            BugHunterLevel1: client.config.emoji.badges.bughunter_level_1,
            BugHunterLevel2: client.config.emoji.badges.bughunter_level_2,
            HypeSquadOnlineHouse1: client.config.emoji.badges.hypesquad_bravery,
            HypeSquadOnlineHouse2: client.config.emoji.badges.hypesquad_brilliance,
            HypeSquadOnlineHouse3: client.config.emoji.badges.hypesquad_balance,
            PremiumEarlySupporter: client.config.emoji.badges.early_supporter,
            VerifiedBot: client.config.emoji.badges.verified_bot,
            VerifiedDeveloper: client.config.emoji.badges.verified_developer,
            CertifiedModerator: client.config.emoji.badges.certified_moderator,
            ActiveDeveloper: client.config.emoji.badges.active_developer
        };

        const activities = member?.presence?.activities?.filter(element => element.id !== 'custom').map(element => {
            if (element.name === 'Spotify') return ` - Listening to **${element.details}** by **${element.state}**`;
            else return ` - ${capitalizeFirstLetter(element.type)} **${element.name}**`;
        }) || [];

        let banner = (await (await fetch(`https://discord.com/api/users/${member.user.id}`, { headers: { Authorization: `Bot ${client.config.bot.info.token}` } })).json()).banner;

        if (banner) {
            const extension = banner.startsWith("a_") ? '.gif' : '.png';

            banner = `https://cdn.discordapp.com/banners/${member.user.id}/${banner}${extension}?size=1024`;
        }

        const nitroEmoji = client.config.emoji.badges.discord_nitro;
        const isNitro = banner !== null || member.user.avatarURL({ dynamic: true }).includes('gif') || member.premiumSince;
        const nitro = isNitro ? nitroEmoji : "";

        const isLegacyUsername = new Date(member.user.createdAt).getTime() < 1677657600000;
        const legacyUsername = isLegacyUsername ? client.config.emoji.badges.legacy_username : "";

        let roles = member.roles.cache.size > 50 ? "Too many roles" : member.roles.cache.size <= 1 ? "No roles." : `<@&${member._roles.join('> <@&')}>`;
        if (roles.length >= 1024) roles = "Too many roles";

        const embed = new EmbedBuilder()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(message.guild.members.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.members.me.displayHexColor)
            .setTitle(member.user.username)
            .addFields(
                {
                    name: "User Identity: ",
                    value: `- **⚙️ ID**: ${member.user.id}\n- **🕐 Created At**: ${formatedDate(member.user.createdAt)}\n- **📛 Badges**: ${badge.length ? badge.map(f => flagToEmoji[f]).join(" ") : ""}${nitro}${member.premiumSince ? (boostLevel(member.premiumSince, client)) : ""}${legacyUsername}\n- **🖼️ Avatar**: [link](${member.user.displayAvatarURL({ type: "png" })})`,
                    inline: false
                },
                {
                    name: "Presence: ",
                    value: `- **📃 Status**: ${status}\n- **⚽ Activity**:\n${activities.slice(0, 5).join('\n') || " - Nothing"}`,
                    inline: false
                },
                {
                    name: "Server Member Info: ",
                    value: `- **💰 Booster**: ${member.premiumSince ? `${formatedDate(member.premiumSince)}` : "Not booster"}\n- **🙍‍♂️ Nickname**: ${member.nickname ? member.nickname : "No nickname set"}\n- **🤖 Bot**: ${member.user.bot ? `${member.user.bot}` : "Not bot account"}\n- **⌛ Joined At**: ${formatedDate(member.joinedAt)}, ${HMS(member.joinedAt)}\n> ${Math.floor(Number(Date.now() - message.guild.members.cache.get(member.id).joinedAt) / 86400000)} day(S) Ago`,
                    inline: false
                },
                {
                    name: `Roles: (${member.roles.cache.size - 1})`,
                    value: roles,
                    inline: false
                }
            );

        if (banner) embed.setImage(banner);

        message.channel.send({ embeds: [embed] });
    },
};