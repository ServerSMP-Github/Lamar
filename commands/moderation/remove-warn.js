const { Message, Client, PermissionsBitField } = require('discord.js');
const Schema = require('../../models/moderator/warn');

module.exports = {
    name: 'remove-warn',
    usage: '[user]',
    aliases : ['r-warn'],
    description : "Remove one warning from a user.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send("User not found.");

        const warnData = await Schema.findOne({ guildid: message.guild.id, user: user.user.id });
        if (!warnData) return message.channel.send("This user does not have any warns in this server");

        warnData.content.splice(parseInt(args[1]) - 1, 1);
        await data.save();

        message.channel.send("deleted the warn");
    }
}