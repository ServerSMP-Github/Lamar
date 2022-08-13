const {
    EmbedBuilder,
    Message,
    Client,
    AttachmentBuilder
} = require('discord.js');

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

        const dice = mathRandomInt(1, 6)
        if (dice == 1) {
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("https://i.imgur.com/IpdrHdQ.png")
            message.reply({
                embeds: [embed]
            })
        } else if (dice == 2) {
            const embed2 = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("https://i.imgur.com/w1IbsxE.png")
            message.reply({
                embeds: [embed2]
            })
        } else if (dice == 3) {
            const embed3 = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("https://i.imgur.com/dYBcXlp.png")
            message.reply({
                embeds: [embed3]
            })
        } else if (dice == 4) {
            const embed4 = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("https://i.imgur.com/KCVtTVk.png")
            message.reply({
                embeds: [embed4]
            })
        } else if (dice == 5) {
            const embed5 = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("https://i.imgur.com/mwZYzWw.png")
            message.reply({
                embeds: [embed5]
            })
        } else if (dice == 6) {
            const embed6 = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Dice")
                .setDescription(`It was ${dice} on the dice.`)
                .setImage("https://i.imgur.com/jPzK5hv.png")
            message.reply({
                embeds: [embed6]
            })
        }

    }
}