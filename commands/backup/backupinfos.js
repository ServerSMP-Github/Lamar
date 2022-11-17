const { Message, Client, EmbedBuilder } = require('discord.js');
const backup = require("discord-backup");

module.exports = {
    name: 'backupinfos',
    usage: '[backupID]',
    aliases : ['bi'],
    description : "Get info on the backup.",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const backupID = args[0];

        try {
            if (!backupID) return message.channel.send(":x: | You must specify a valid backup ID!");

            const backupData = await backup.fetch(backupID);

            const date = new Date(backupData.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;

            message.channel.send({ embeds: [
                new EmbedBuilder()
                .setAuthor({ name: "Backup Informations" })
                .setColor("#FF0000")
                .addFields([
                    { name: "Backup ID", value: backupData.id, inline: false },
                    { name: "Server ID", value: backupData.data.guildID, inline: false },
                    { name: "Size", value: `${backupData.size} kb`, inline: false },
                    { name: "Created at", value: formatedDate, inline: false }
                ])
            ]});
        } catch (err) {
            console.error(err);
            return message.channel.send(`:x: | No backup found for \`${backupID}\`!`);
        }
    }
}
