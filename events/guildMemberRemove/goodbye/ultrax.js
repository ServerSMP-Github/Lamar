const { ultrax } = require("../../../assets/api/canvas/GoodbyeWelcomeCards");
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "ultrax",
    run: async (data, client, channel, member) => {
        return channel.send({
            files: [
                new AttachmentBuilder(await ultrax({
                    font: data.Options.font ? data.Options.font : "Arial",
                    background: data.Options.background ? data.Options.background : null,
                    color: data.Options.color ? data.Options.color : "#ffffff",
                    text: {
                        title: "Has left this server",
                        subtitle: " "
                    },
                    user: {
                        username: member.user.username,
                        avatar: member.user.displayAvatarURL({ extension: "png", size: 2048 })
                    }
                }), { name: `goodbye-${member.id}.png` })
            ]
        });
    }
}