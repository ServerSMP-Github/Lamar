const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder } = require("discord.js");
const pagination = require('../../assets/js/button-pagination');

module.exports = {
    name: "credit",
    description: "Credit to the people that help this project.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed0 = new EmbedBuilder()
            .setTitle("Credit - Prince527")
            .setColor("#ffff00")
            .addField("Prince527", "He started the project!")
            .setThumbnail("https://serversmp-api.herokuapp.com//upload/1/prince/fZEOffbr03.png")
        const embed1 = new EmbedBuilder()
            .setTitle("Credit - Wam25")
            .setColor("#ffffff")
            .addField("Wam25", "The duck command would not be here if it was not for him!")
            .setThumbnail("https://serversmp-api.herokuapp.com//upload/1/prince/NiWhmQI7Zs.png")
        const embed2 = new EmbedBuilder()
            .setTitle("Credit - arpi")
            .setColor("#E7C9C5")
            .addField("arpi", "He helped beta test some new commands!")
            .setThumbnail("https://serversmp-api.herokuapp.com//upload/1/prince/x4KlYDIhiq.png")
        const embed3 = new EmbedBuilder()
            .setTitle("Credit - txtur")
            .setColor("#AADFEB")
            .addField("txtur", "He did make the logo for the BOT!")
            .setThumbnail("https://serversmp-api.herokuapp.com//upload/1/prince/8aec1d068cfec852364d8caee9bdee7aelvcyqqd.png")
        const embed4 = new EmbedBuilder()
            .setTitle("Credit - reconlx")
            .setColor("#0F2D53")
            .addField("reconlx", "He did some great youtube vids that help me (Prince527) start makeing the bot!")
            .setThumbnail("https://avatars.githubusercontent.com/u/66986299?v=4")
        const embed5 = new EmbedBuilder()
            .setTitle("Credit - UltraX")
            .setColor("#FFFFFF")
            .addField("UltraX", "He did some great youtube vids that help me (Prince527) start makeing the bot!")
            .setThumbnail("https://avatars.githubusercontent.com/u/67840146?v=4")
        const embed6 = new EmbedBuilder()
            .setTitle("Credit - DashCruft")
            .setColor("#90C9DC")
            .addField("DashCruft", "He did some great youtube vids that help me (Prince527) start makeing the bot!")
            .setThumbnail("https://avatars.githubusercontent.com/u/59381835?v=4")

        const embeds = [embed0, embed1, embed2, embed3, embed4, embed5, embed6];

        pagination(message, embeds);
    },
};
