const { EmbedBuilder, Message, Client, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'announce',
    usage: '[#channel] [message] [-ping ?]',
    aliases : ['an'],
    description : "The bot can send your announcement!",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {

        let mention;

        if(!args.length) return message.channel.send(`> Usage: ${client.prefix(message)}announce <#channel> <message> <-ping ?>`);

        const channel = message.mentions.channels.first();
        if(!channel) return message.reply('Please specify a channel!');

        if(!args[1]) return message.reply('Please specify a message to announce');

        if(args.some((val) => val.toLowerCase() === '-ping')) {
            for (let i = 0; i < args.length; i++ ) {
                if(args[i].toLowerCase() === '-ping') args.splice(i, 1);
            }
            mention = true;
        } else mention = false;

        if(mention === true) channel.send('@everyone');

        channel.send({ embeds: [
            new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setColor('Random')
        ]})

    }
}
