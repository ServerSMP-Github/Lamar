const Schema = require('../../models/management/blacklist');
const { Message, Client } = require('discord.js');

module.exports = {
    name: 'blacklist',
    usage: '[ add | remove ] [ server ]',
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
        if (!query) return message.reply("Query incorrect.");
        if (!["add", "remove"].includes(query)) return message.reply("Invalid query.");

        const id = args[1];
        if (!id) return message.reply('Please specify a guild id!');

        const blacklistData = await Schema.findOne({ Server: id });
        if (!blacklistData) return message.reply(query == "add" ? "This server has already been blacklisted before!" : "That guild id does not exist in the database!");

        if (query === "add") await Schema.create({ Server: id });
        else await blacklistData.delete();

        message.reply(query == "add" ? "Blacklisted a new server/guild!" : "Guild was unblacklisted successfully!");
    }
}
