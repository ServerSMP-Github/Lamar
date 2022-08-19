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
        let pollChannel = message.mentions.channels.first();
        let pollDescription = args.slice(1).join(' ');

        let embedPoll = new EmbedBuilder()
            .setTitle('New Poll!')
            .setDescription(pollDescription)
            .setColor('Yellow')

        let msgEmbed = await pollChannel.send({ embeds: [embedPoll] });
        await msgEmbed.react('👍');
        await msgEmbed.react('👎');
    }
}