const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const instance = require("../../../models/user/fg-instance");

module.exports = {
    name: "cc",
    run: async (client, message, args) => {
        const getInstance = await instance.findOne({ guild: message.guild.id, user: message.author.id });
        if (!getInstance) return message.reply({ content: "You have not challenged the bot!" });

        message.channel.send({
            content: "Re-sending!",
            embeds: [
                new EmbedBuilder()
                .setTitle("Guess the flag?")
                .setImage(`https://flagcdn.com/w1280/${getInstance.country}.png`)
                .setColor("Random")
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("fg-stop")
                    .setLabel("Stop")
                    .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                    .setCustomId("fg-skip")
                    .setLabel("Skip")
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
        });
    }
}