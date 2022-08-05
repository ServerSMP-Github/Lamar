const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "biden-tweet",
    usage: '[text]',
    aliases: ['bt'],
    description: "Yep, you are sending a biden tweet.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const sentence = args.join(" ")
        if (!sentence) return message.channel.send('Please specify a query.')
        const embed = new EmbedBuilder()
          .setTitle('Joe Biden')
          .setImage(`https://api.popcat.xyz/biden?text=${encodeURIComponent(sentence)}`)
          .setColor('ORANGE')
        message.channel.send({ embeds: [embed] })
    },
};