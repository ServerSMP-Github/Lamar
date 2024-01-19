const { Message, Client, PermissionsBitField } = require('discord.js');
const customSchema = require('../../models/server/cc');

module.exports = {
    name: 'cc-create',
    usage: '[name] [response]',
    description: "Create personalized commands for tailored responses.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const name = args[0];
        const response = args.slice(1).join(" ");

        if(!name) return message.channel.send('Please specify a command name');
        if(!response) return message.channel.send('Please specify a response');

        const customData = await customSchema.findOne({ Guild: message.guild.id, Command: name }).exec();
        if (customData) return message.channel.send('This custom commands exists already!');

        await customSchema.create({
            Guild: message.guild.id,
            Command: name,
            Response: response
        });

        message.channel.send(`Saved **${name}** as a custom command!`);
    }
}
