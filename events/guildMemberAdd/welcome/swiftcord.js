const { swiftcord } = require("../../../assets/api/canvas/GoodbyeWelcomeCards");
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "swiftcord",
    run: async (data, client, channel, member) => {
        return channel.send({
            files: [
                new AttachmentBuilder(await swiftcord({
                    type: "welcome",
                    background: data.Options.background ? data.Options.background : null,
                    user: {
                        username: member.user.username,
                        discriminator: member.user.discriminator,
                        avatar: member.user.displayAvatarURL({ extension: "png", size: 2048 })
                    },
                    server: {
                        name: member.guild.name,
                        title: `- ${member.guild.memberCount}th member!`,
                        icon: member.guild.iconURL({ extension: "png" })
                    }
                }), { name: `welcome-${member.id}.png` })
            ]
        });
    }
}