const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomInt } = require("../../../assets/api/crypto");
const instance = require("../../../models/user/fg-instance");
const gameData = require("../../../assets/api/fg/game.json");

module.exports = {
    name: "skip",
    run: async (client, message, args) => {
        const getInstance = await instance.findOne({ guild: message.guild.id, user: message.author.id });
        if (!getInstance) return message.reply({ content: "You have not challenged the bot!" });

        const lastCountry = getInstance.country;

        const array = gameData.list;
        const country = array[getRandomInt(0, array.length)];

        getInstance.country = country;
        await getInstance.save();

        message.channel.send({
            content: `Skipped ${gameData.name[lastCountry]}!`,
            embeds: [
                new EmbedBuilder()
                .setTitle("Guess the flag?")
                .setImage(`https://flagcdn.com/w1280/${country}.png`)
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
                    .setCustomId(`fg-stop-${message.author.id}`)
                    .setLabel("Stop")
                    .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                    .setCustomId(`fg-skip-${message.author.id}`)
                    .setLabel("Skip")
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
        });
    }
}