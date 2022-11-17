const { Message, Client, AttachmentBuilder } = require("discord.js");

module.exports = {
    name: "thicc",
    usage: '[@user (or not)]',
    description: "Thicc...",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.author;
        const avatar = user.displayAvatarURL({ dynamic: false, format: "png" })
        const img = `https://api.popcatdev.repl.co/wide?image=${avatar}`;
        const image = new AttachmentBuilder(img, { name: `wide_${user.username}.png` })
        message.channel.send({ files: [image] })
    },
};