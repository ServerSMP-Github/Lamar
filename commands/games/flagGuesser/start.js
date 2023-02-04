const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomInt } = require("../../../assets/api/crypto");
const instance = require("../../../models/user/fg-instance");
const gameData = require("../../../assets/api/fg/game.json");

module.exports = {
    name: "start",
    run: async (client, message, args) => {
        const userCheck = await instance.findOne({ guild: message.guild.id, user: message.author.id });
        if (userCheck) return message.reply({ content: "You already have a challenge!" });

        const array = gameData.list;
        const country = array[getRandomInt(0, array.length)];

        await instance.create({
            country,
            guild: message.guild.id,
            user: message.author.id,
        });

        message.channel.send({
            content: "Started challenge!",
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