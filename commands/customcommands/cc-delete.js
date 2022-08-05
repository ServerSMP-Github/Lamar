const { Message, Client } = require('discord.js');
const schema = require('../../models/server/cc');

module.exports = {
    name: 'cc-delete',
    usage: '[name of command]',
    description : "Delete custom commands!",
    userPermission: ["ADMINISTRATOR"],
    aliases: ['011000110110001100101101011001000110010101101100011001010111010001100101'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const name = args[0];

        if(!name) return message.channel.send('Please specify a command name');

        const data = await schema.findOne({ Guild: message.guild.id, Command: name }).exec();
        if(!data) return message.channel.send('That custom command does not exist!');
        await schema.findOneAndDelete({ Guild: message.guild.id, Command: name });
        message.channel.send(`Removed **${name}** from custom commands!`);
    }
}
