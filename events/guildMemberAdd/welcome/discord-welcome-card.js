const { discordWelcomeCard } = require("../../../assets/api/canvas/GoodbyeWelcomeCards");
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "discord-welcome-card",
    run: async (data, client, channel, member) => {
        return channel.send({
            files: [
                new AttachmentBuilder(await discordWelcomeCard({
                    theme: data.Options.theme ? data.Options.theme : "dark",
                    text: {
                        title: "Welcome to this server,",
                        user: member.user.tag,
                        subtitle: `MemberCount: ${member.guild.memberCount}`
                    },
                    avatar: member.user.avatarURL({ extension: 'png' }),
                    blur: data.Options.blur ? data.Options.blur : true,
                    border: data.Options.border ? data.Options.border : true,
                    rounded: data.Options.rounded ? data.Options.rounded : true
                }), { name: `welcome-${member.id}.png` })
            ] 
        });
    }
}