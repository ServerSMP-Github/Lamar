const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getRandomInt } = require("../../assets/api/crypto");
const gameData = require("../../assets/api/fg/game.json");
const instance = require("../../models/user/fg-instance");
const lb = require("../../models/user/fg-leaderboard");
const client = require("../../index");

module.exports = async(message) => {
    if (message.author.bot || !message.content || !message.author) return;

    const getInstance = await instance.findOne({ guild: message.guild.id, user: message.author.id });
    if (!getInstance) return;

    if (message.content.toLowerCase() !== gameData.name[getInstance.country].toLowerCase()) return;

    const array = gameData.list;
    const country = array[getRandomInt(0, array.length)];

    getInstance.country = country;
    await getInstance.save();

    let getUser = await lb.findOne({ id: message.author.id });
    if (!getUser) getUser = await lb.create({
        id: message.author.id,
        user: message.author.username,
    });

    getUser.points++;
    await getUser.save();

    message.channel.send({
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