const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder, MessageAttachment } = require('discord.js');
const Schema = require('../../models/management/blacklist');

module.exports = {
    name: 'blacklist',
    usage: '[ add | remove ] [ serverID ]',
    description : "Owners can blacklist a server from using the bot.",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if (!client.config.command.owner.blacklist) return message.reply("This command is disabled!");

        const query = args[0]?.toLowerCase();
        if(!query) return message.reply("Query incorrect.");

        if(query === "add") {
            const id = args[1];
            if(!id) return message.reply('Please specify a guild id!');
            Schema.findOne({ Server: id }, async(err, data) => {
                if(data) return message.reply("This server has already been blacklisted before!");
                new  Schema({
                    Server: id
                }).save();
                message.reply("Blacklisted a new server/guild!");
            })
        } else if(query === "remove") {
            const id = args[1];
            if(!id) return message.reply('Please specify a guild id!');
            Schema.findOne({ Server: id }, async(err, data) => {
                if(!data) return message.reply('That guild id does not exist in the database!');
                data.delete();
                message.reply("Guild was unblacklisted successfully!");
            })
        } else return message.reply("Query incorrect")

    }
}
