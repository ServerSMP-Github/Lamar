const { Message, Client, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'poll',
    usage: '[#channel] [what is the poll]',
    description : "Admins can make polls.",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const pollChannel = message.mentions.channels.first();
        const pollDescription = args.slice(1).join(' ');

        if (!pollChannel || !pollDescription) return message.channel.send({ content: "Missing arguments" });

        const msgEmbed = await pollChannel.send({ embeds: [
            new EmbedBuilder()
            .setTitle('New Poll!')
            .setDescription(pollDescription)
            .setColor('Yellow')
        ]});

        await msgEmbed.react('👍');
        await msgEmbed.react('👎');
    }
}