const { Message, Client, PermissionsBitField } = require('discord.js');
const customSchema = require('../../models/server/cc');

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

        const customData = await customSchema.findOne({ Guild: message.guild.id, Command: name }).exec();
        if (!customData) return message.channel.send('That custom command does not exist!');

        await customData.deleteOne();

        message.channel.send(`Removed **${name}** from custom commands!`);
    }
}
