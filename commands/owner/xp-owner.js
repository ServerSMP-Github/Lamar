const { Message, Client } = require('discord.js');
const Levels = require('discord-xp');

module.exports = {
    name: 'xp-owner',
    usage: '[ level | xp ] [ user ] [ guild ] [ amount ]',
    description: "Change level and xp of users.",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if (!client.config.command.owner["xp-owner"]) return message.reply("This command is disabled!");

        const query = args[0]?.toLowerCase();
        if (!query || !["level", "xp"].includes(query)) return message.reply(`\`${await client.prefix(message)}xp-owner [ level | xp ] [ user ] [ guild ] [ amount ]\`\n**Change level and xp of users.**`);

        const user = args[1];
        const guild = args[2];
        const amount = args[3]

        if (!user || !guild || !amount) return message.reply("Please specify a user, guild and amount!");

        if (query === "level") Levels.setLevel(user, guild, amount);
        else if (query === "xp") Levels.setXp(user, guild, amount);

        message.reply(`Changed ${query} of ${user} on ${guild}`);
    }
}
