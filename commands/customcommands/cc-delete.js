const { Message, Client, PermissionsBitField } = require('discord.js');
const schema = require('../../models/server/cc');

module.exports = {
    name: 'cc-delete',
    usage: '[name of command]',
    description : "Delete custom commands!",
    userPermission: [PermissionsBitField.Flags.Administrator],
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
