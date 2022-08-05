const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
const {
    Message,
    Client,
    MessageActionRow,
    MessageButton,
    EmbedBuilder
} = require("discord.js");
const { formatedDate, HMS } = require('../../assets/api/time/index');
const axios = require('axios');

function checkbadge(x, client) {
    if (!x) return "";
    const duration = Date.now() - x;
    let badge = "";
    if(duration >  1000 * 60 * 60 * 24 * 30 * 24) {
        badge = client.config.emoji.boost_level.level_9;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *18) {
        badge = client.config.emoji.boost_level.level_8;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *15) {
        badge = client.config.emoji.boost_level.level_7;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *12) {
        badge = client.config.emoji.boost_level.level_6;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *9) {
        badge = client.config.emoji.boost_level.level_5;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *6) {
        badge = client.config.emoji.boost_level.level_4;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *3) {
        badge = client.config.emoji.boost_level.level_3;
    } else if(duration >  1000 * 60 * 60 * 24 * 30 *2) {
        badge = client.config.emoji.boost_level.level_2;
    } else {
        badge = client.config.emoji.boost_level.level_1;
    }

    return badge;
}

module.exports = {
    name: "memberinfo",
    usage: '[@user (or not)]',
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

        let status;
        try {
            if (member.presence.status === "dnd") {
                status = "🔴"
            } else if (member.presence.status === "idle") {
                status = "🟡"
            } else if (member.presence.status === "online") {
                status = "🟢"
            } else if (member.presence.status === "streaming") {
                status = "🟣"
            }
        } catch(err) {
            status = "⚫"
        }

        let badge = member.user.flags.toArray();

        const flags = {
            DISCORD_EMPLOYEE: client.config.emoji.badges.DISCORD_EMPLOYEE,
            DISCORD_PARTNER: client.config.emoji.badges.DISCORD_PARTNER,
            DISCORD_CLASSIC: client.config.emoji.badges.DISCORD_CLASSIC,
            BUGHUNTER_LEVEL_1: client.config.emoji.badges.BUGHUNTER_LEVEL_1,
            BUGHUNTER_LEVEL_2: client.config.emoji.badges.BUGHUNTER_LEVEL_2,
            HYPESQUAD_EVENTS: client.config.emoji.badges.HYPESQUAD_EVENTS,
            HOUSE_BRAVERY: client.config.emoji.badges.HOUSE_BRAVERY,
            HOUSE_BRILLIANCE: client.config.emoji.badges.HOUSE_BRILLIANCE,
            HOUSE_BALANCE: client.config.emoji.badges.HOUSE_BALANCE,
            EARLY_SUPPORTER: client.config.emoji.badges.EARLY_SUPPORTER,
            VERIFIED_BOT: client.config.emoji.badges.VERIFIED_BOT,
            VERIFIED_DEVELOPER: client.config.emoji.badges.VERIFIED_DEVELOPER,
            EARLY_VERIFIED_DEVELOPER: client.config.emoji.badges.EARLY_VERIFIED_DEVELOPER,
        };

        const activities = [];
        member?.presence?.activities.forEach(activity => {
            if (activity.id !== 'custom') {
                if (activity.name === 'Spotify') activities.push(` **•** Listening to **${activity.details}** by **${activity.state}**`);
                else activities.push(` **•** ${capitalizeFirstLetter(activity.type)} **${activity.name}**`);
            }
        });

        let bannerCheck = null;
        let bannerLink = null;
        try {
            await axios.get(`https://discord.com/api/users/${member.user.id}`, {
                headers: {
                    Authorization: `Bot ${client.config.token}`
                }
            }).then(res => {
                const { banner } = res.data;

                if (banner) {
                    bannerCheck = true;
                    const extension = banner.startsWith("a_") ? '.gif' : '.png';
                    const url = `https://cdn.discordapp.com/banners/${member.user.id}/${banner}${extension}?size=1024`;
                    bannerLink = url;
                }
            });
        } catch (err) {
            bannerCheck = null;
        }

        let nitro = "";
        if (bannerCheck !== null || member.user.avatarURL({ dynamic: true }).includes('gif')) nitro = client.config.emoji.badges.DISCORD_NITRO;

        let roles = `<@&${member._roles.join('> <@&')}>`;
        if (member.roles.cache.size > 50) roles = "Too many roles";
        if (roles.length === 0) roles = `No roles.`;

        const embed = new EmbedBuilder()
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor)
            .setTitle(`${member.user.tag}`)
            .addFields({
                name: "User Identity: ",
                value: `**⚙️ ID**: ${member.user.id}\n**🕐 Created At**: ${formatedDate(member.user.createdAt)}\n**📛 Badges**: ${badge.length ? badge.map(f => flags[f]).join(" ") : ""}${nitro}${member.premiumSince ? (checkbadge(member.premiumSince, client)) : ""}\n**🖼️ Avatar**: [link](${member.user.displayAvatarURL({ type: "png" })})`,
                inline: false
            }, {
                name: "Presence: ",
                value: `**📃 Status**: ${status}\n**⚽ Activity**:\n${activities.join('\n') ? activities.slice(0, 5).join('\n') : " **•** Nothing"}`,
                inline: false
            }, {
                name: "Server Member Info: ",
                value: `**💰 Booster**: ${member.premiumSince ? `${formatedDate(member.premiumSince)}` : "Not booster"}\n**🙍‍♂️ Nickname**: ${member.nickname ? member.nickname : "No nickname set"}\n**🤖 Bot**: ${member.user.bot ? `${member.user.bot}` : "Not bot account"}\n**⌛ Joined At**: ${formatedDate(member.joinedAt)}, ${HMS(member.joinedAt)}\n> ${Math.floor(Number(Date.now() - message.guild.members.cache.get(member.id).joinedAt) / 86400000)} day(S) Ago`,
                inline: false
            }, {
                name: `Roles: (${Number(member.roles.cache.size) - 1})`,
                value: `${roles}`,
                inline: false
            });

        if (bannerCheck === true) embed.setImage(bannerLink);

        message.channel.send({ embeds: [embed] });
    },
};