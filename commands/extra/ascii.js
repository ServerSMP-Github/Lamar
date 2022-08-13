const {
    EmbedBuilder,
    Message,
    Client,
    AttachmentBuilder
} = require('discord.js');
const figlet = require('figlet');

module.exports = {
    name: 'ascii',
    description: "Change your text to ascii art.",
    usage: '[ text ]',

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        if (!args.length) return message.reply("Please specify some text to ascii.")

        try {
            figlet.text(args.join(" "), {
                font: "",
            }, async (err, data) => {
                message.channel.send(`\`\`\`${data.slice(0, 1980)}\`\`\``).catch((err) => {
                    return message.reply("An error occurred.");
                });
            });
        } catch (err) {
            console.error(err);
            return message.reply("An error occurred!");
        }

    }
}
