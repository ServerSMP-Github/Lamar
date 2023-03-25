const { discordWelcomer } = require("../../../assets/api/canvas/GoodbyeWelcomeCards");
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: "discord-welcomer",
    run: async (data, client, channel, member) => {
        return channel.send({
            files: [
                new AttachmentBuilder(await discordWelcomer({
                    background: data.Options.background ? data.Options.background : null,
                    title: "Goodbye (>д<)",
                    username: member.user.username,
                    avatar: member.user.displayAvatarURL({ extension: "png", dynamic: true })
                }), { name: `goodbye-${member.id}.png` })
            ]
        });
    }
}