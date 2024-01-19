const { setLevel, setXp } = require("../../assets/api/xp");
const { Message, Client } = require('discord.js');

module.exports = {
    name: 'xp-owner',
    usage: '[level | xp] [user] [guild] [amount]',
    description: "Modify the level and XP of users in a guild.",
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
        const amount = Number(args[3]);

        if (!user || !guild || !amount < 0) return message.reply("Please specify a user, guild and amount!");

        if (query === "level") setLevel(user, guild, amount);
        else if (query === "xp") setXp(user, guild, amount);

        message.reply(`Changed **${query}** of **${user}** on **${guild}**`);
    }
}
