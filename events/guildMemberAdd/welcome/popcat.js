const { popcat } = require("../../../assets/api/canvas/GoodbyeWelcomeCards");
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "popcat",
    run: async (data, client, channel, member) => {
        return channel.send({
            files: [
                new AttachmentBuilder(await popcat({
                    text: {
                        title: `Welcome To ${member.guild.name}`,
                        subtitle: `Member ${member.guild.memberCount}`
                    },
                    user: {
                        username: member.user.username,
                        avatar: member.user.displayAvatarURL({ extension: "png", size: 2048 })
                    }
                }), { name: `welcome-${member.id}.png` })
            ]
        });
    }
}