const { Message, Client, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Schema = require('../../models/moderator/warn');

module.exports = {
    name: 'warn',
    usage: '[user] [reason]',
    description : "Issue a warning to a user.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send("User not found.");

        let reasonArgs = args.slice(1).join(" ");
        const reason = reasonArgs ? reasonArgs : "no reason specified";

        let warnData = await Schema.findOne({ guildid: message.guild.id, user: user.user.id });
        if (!warnData) warnData = await Schema.create({ guildid: message.guild.id, user : user.user.id });

        warnData.content.push({
            moderator: message.author.id,
            reason : reason
        });
        await warnData.save();

        user.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`You have been warned for ${reason}`)
                .setColor("Red")
            ]
        });

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Warned ${user} for ${reason}`)
                .setColor('Blue')
            ]
        });

    }
}