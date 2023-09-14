const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');
const { getRandomInt } = require("../../assets/api/crypto");

module.exports = {
    name: 'dice',
    description: "Roll a six-sided die.",

    /**
     *
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const dice = getRandomInt(1, 6);

        message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("attachment://dice.webp")
            ],
            files: [
                new AttachmentBuilder(`${__dirname}/../../assets/api/dice/${dice}.webp`, { name: "dice.webp" })
            ]
        });

    }
}