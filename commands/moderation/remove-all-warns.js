const { Message, Client, PermissionsBitField } = require('discord.js');
const Schema = require('../../models/moderator/warn');

module.exports = {
    name: 'remove-all-warns',
    usage: '[user]',
    aliases: ['clearwarns'],
    description: "Remove all warnings from a user.",
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
        if (!warnData) return message.channel.send("This user does not have any warns in this server!");

        await Schema.findOneAndDelete({ guildid: message.guild.id, user: user.user.id });
        message.channel.send(`Cleared ${user.user.username}'s warns`);
    }
}