const { Message, Client, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clear',
    aliases : ['purge'],
    usage: '[1-100]',
    description : "Remove messages.",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    botPermission: [PermissionsBitField.Flags.ManageMessages],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const int = Number(args[0]);

        if (!int) return message.reply({ content: "Please specify the number of messages to delete" });
        if (!Number.isInteger(Number(int))) return message.reply({ content: "The number of message must be a number" });
        if (int > 100) return message.reply({ content: "The maximum amount of messages you can delete is 100 messages" });

        try {
            const deletedMessages = await message.channel.bulkDelete(int + 1, true);

            const results = {};
            for (const [, deleted] of deletedMessages) {
                const user = `${deleted.author.username}#${deleted.author.discriminator}`;
                if (!results[user]) results[user] = 0;
                results[user]++;
            }

            const userMessageMap = Object.entries(results);

            await message.channel.send({ content: `${deletedMessages.size} message${deletedMessages.size > 1 ? 's' : ''} were removed!\n\n${userMessageMap.map(([user, messages]) => `**${user}** : ${messages}`).join('\n')}` }).then(async(msg) => setTimeout(() => msg.delete().catch(err => {return}), 5000));
        } catch (err) {
            message.reply("An error has occurred.");
        }
    }
}
