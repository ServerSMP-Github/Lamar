const { Message, Client } = require('discord.js');
const backup = require("discord-backup");

module.exports = {
    name: 'backupcreate',
    aliases : ['bc', '011000100110000101100011011010110111010101110000011000110111001001100101011000010111010001100101'],
    description : "Create a backup of you're server.",
    userPermission: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
      try {
        backup.create(message.guild, {
            jsonBeautify: true
        }).then(async(backupData) => {
            const p = await client.prefix(message)
            message.author.send("The backup has been created! To load it, type this command on the server of your choice: `"+p+"backupload "+backupData.id+"`!");
            message.channel.send(":white_check_mark: Backup successfully created. The backup ID was sent in dm!");
        }).catch((err) => {
          console.error(err);
          return message.reply("An error occurred!.")
        });
      } catch (err) {
        console.error(err);
        return message.reply("An error occurred!.")
      }
    }
}
