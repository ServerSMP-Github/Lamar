const { Message, Client } = require('discord.js');
const schema = require('../../models/server/cc');

module.exports = {
    name: 'cc-create',
    usage: '[name] [what it do]',
    description: "Create custom commands!",
    userPermission: ["ADMINISTRATOR"],
    aliases: ['011000110110001100101101011000110111001001100101011000010111010001100101'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const name = args[0]; const response = args.slice(1).join(" ");

        if(!name) return message.channel.send('Please specify a command name');
        if(!response) return message.channel.send('Please specify a response');

        const data = await schema.findOne({ Guild: message.guild.id, Command: name }).exec();
        if(data) return message.channel.send('This custom commands exists already!');
        const newData =  new schema({
            Guild: message.guild.id,
            Command: name,
            Response: response
        })
        await newData.save();
        message.channel.send(`Saved **${name}** as a custom command!`);
    }
}
