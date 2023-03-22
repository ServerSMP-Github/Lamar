const { createCard } = require('../../assets/api/canvas/discordCard');
const Schema = require('../../models/logs/goodbye');
const client = require("../../index");

module.exports = async(member) => {
    const welcomeData = await Schema.findOne({ Guild: member.guild.id });
    if (!welcomeData) return;

    const channel = member.guild.channels.cache.get(welcomeData.Channel);

    channel.send({
        files: [
            await createCard({
                theme: 'dark',
                text: {
                    title: "Goodbye,",
                    user: member.user.tag,
                    subtitle: " "
                },
                avatar: member.user.avatarURL({ extension: 'png' }),
                blur: true,
                border: true,
                rounded: true
            })
        ]
    });
}