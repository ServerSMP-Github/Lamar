const { AttachmentBuilder, EmbedBuilder, Message, Client } = require('discord.js');

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

        const dice = Math.floor(Math.random() * (6 - 1)) + 1;

        message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("attachment://dice.png")
            ],
            files: [
                new AttachmentBuilder(`${__dirname}/../../assets/api/dice/${dice}.png`, { name: "dice.png" })
            ]
        });

    }
}