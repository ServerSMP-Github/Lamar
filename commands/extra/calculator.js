const { Message, Client } = require('discord.js');
const { calculator } = require('simply-djs')

module.exports = {
    name: 'calculator',
    description : "Use a calculator in discord.",
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
