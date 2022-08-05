const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const { calculator } = require('simply-djs')

module.exports = {
    name: 'calculator',
    description : "Use a calculator in discord.",
    aliases: ['01100011011000010110110001100011011101010110110001100001011101000110111101110010'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        calculator(message, {
            embedColor: '#075eff',
        })
    }
}
