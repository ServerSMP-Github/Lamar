const { EmbedBuilder, Message, Client, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "announce",
    usage: "[channel] [message] [-ping?]",
    aliases : ["an"],
    description : "Have the bot send your announcement to a specified channel, with an optional mention.",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {

        let mention;

        if (!args.length) return message.channel.send(`> Usage: ${client.prefix(message)}announce [ #channel ] [ message ] [ -ping? ]`);

        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('Please specify a channel!');

        if (!args[1]) return message.reply('Please specify a message to announce');

        if (args.some((val) => val.toLowerCase() === '-ping')) {
            for (let i = 0; i < args.length; i++ ) args[i].toLowerCase() === '-ping' ? args.splice(i, 1) : null;
            mention = true;
        } else mention = false;

        channel.send({
            content: mention === true ? '@everyone' : null,
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(args.slice(1).join(" "))
                .setColor('Random')
                .setTimestamp()
            ]
        });

    }
}
