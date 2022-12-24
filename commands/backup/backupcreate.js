const { Message, Client, PermissionsBitField } = require('discord.js');
// const backup = require("discord-backup");

module.exports = {
    name: 'backupcreate',
    aliases : ['bc'],
    description : "Create a backup of you're server.",
    userPermission: [PermissionsBitField.Flags.Administrator],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
      try {
        const backupData = await backup.create(message.guild, { jsonBeautify: true });

        const prefix = await client.prefix(message);
        message.author.send(`The backup has been created! To load it, type this command on the server of your choice: \`${prefix}backupload ${backupData.id}\`!`);
        message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
      } catch (err) {
        console.error(err);
        return message.reply("An error occurred!.")
      }
    }
}
