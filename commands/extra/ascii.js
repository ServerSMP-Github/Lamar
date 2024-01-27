const { stringToAscii } = require('../../assets/api/ascii');
const { Message, Client } = require('discord.js');

module.exports = {
    name: 'ascii',
    usage: '[text]',
    description: "Transform text into ASCII art.",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!args.length) return message.reply("Please specify some text to ascii.")

        try {
            const text = stringToAscii(args.join(" "));

            message.channel.send(`\`\`\`${text.slice(0, 1980)}\`\`\``);
        } catch (err) {
            console.error(err);

            return message.reply("An error occurred!");
        }

    }
}
