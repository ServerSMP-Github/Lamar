const { Message, Client, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Schema = require('../../models/moderator/warn');

module.exports = {
    name: 'warns',
    usage: '[user]',
    description : "View all the warnings a user has received.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send("User not found.");

        const warnData = await Schema.findOne({ guildid: message.guild.id, user: user.user.id });
        if (!warnData) return message.channel.send("User has no data.");

        message.channel.send({ 
            embeds: [
                new EmbedBuilder()
                .setTitle(`${user.user.username}'s warns`)
                .setDescription(String(warnData.content.map((w, i) => `\`${i + 1}\` | Moderator : ${message.guild.members.cache.get(w.moderator).user.username}\nReason : ${w.reason}`)))
                .setColor("Blue")
            ]
        });
    }
}