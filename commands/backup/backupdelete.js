const { Message, Client, PermissionsBitField, EmbedBuilder } = require('discord.js');
const backup = require("discord-backup");

module.exports = {
    name: 'backupdelete',
    usage: '[backupID]',
    aliases : ['bd'],
    description : "Delete a backup.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const backupID = args[0];
        if (!backupID) return message.channel.send(":x: | You must specify a valid backup ID!");

        backup.remove(backupID);

        message.channel.send({ embeds: [
            EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Backup delete")
            .setDescription(`Deleted backup \`${backupID}\`.`)
        ]});
    }
}
