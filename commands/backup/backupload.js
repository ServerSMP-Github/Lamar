const { Message, Client, PermissionsBitField } = require('discord.js');
// const backup = require("discord-backup");

module.exports = {
    name: 'backupload',
    usage: '[backupID]',
    aliases : ['bl'],
    description : "Load the backup of you're server.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {

        const backupID = args[0];

        try {
            const getBackup = await backup.fetch(backupID);

            if (!getBackup) return message.channel.send(`:x: No backup found for ID \`${backupID}\`!`);

            message.channel.send(':warning: All the server channels, roles, and settings will be cleared. Do you want to continue? Send `-confirm` or `cancel`!');

            const filter = (member) => member.author.id === message.author.id;

            const collector = message.channel.createMessageCollector({
                filter,
                time: 60000,
                max: 1
            });

            collector.on('collect', async(msg) => {
                if (!msg.content) return collector.stop('error');

                if (!['-confirm', 'cancel'].includes(msg.content)) return collector.stop('error');
                if (msg.content == '-confirm') return collector.stop('done');
                if (msg.content == 'cancel') return collector.stop('cancel');
            });

            collector.on('end', async(collected, reason) => {
                if (reason === 'time') return message.channel.send(':x: Command timed out! Please retry.');
                if (reason == 'error') return message.channel.send('You did not provide valid option!');
                if (reason == 'cancel') return message.channel.send('Cancelled loading of backup!');
                if (reason == 'done') {
                    try {
                        await backup.load(backupID, message.guild);

                        await backup.remove(backupID);

                        return message.channel.send({ content: "Backup loaded successfully!" });
                    } catch (err) {
                        if (err === 'No backup found') return message.channel.send(`:x: No backup found for ID \`${backupID}\`!`);
                        else {
                            console.error(err);
                            return message.author.send(':x: An error occurred');
                        }
                    }
                }
            });
        } catch (err) {
            return message.channel.send(`:x: No backup found for ID \`${backupID}\`!`);
        }

    }
}
