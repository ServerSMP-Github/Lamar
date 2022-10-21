const { Message, Client, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'unban',
    description : "Unban users using commands.",
    userPermission: [PermissionsBitField.Flags.BanMembers],
    botPermission: [PermissionsBitField.Flags.BanMembers],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!args[0]) return message.reply("You need the id of the user.");

        const toBan = await client.users.fetch(args[0])
        if(!toBan) return message.reply("You need the id of the user.");

        const reason = args[1] || "There was no reason!";

        message.guild.members.unban(toBan, reason);

        message.channel.send(`${toBan} has been unbanned from the server!`);
    }
}