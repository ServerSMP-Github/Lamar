const instance = require("../../../models/user/fg-instance");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "stop",
    run: async (client, message, args) => {
        const getInstance = await instance.findOne({ guild: message.guild.id, user: message.author.id });
        if (!getInstance) return message.reply({ content: "You have not challenged the bot!" });

        await getInstance.deleteOne();

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("Stopped challenge!")
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
            ]
        });
    }
}