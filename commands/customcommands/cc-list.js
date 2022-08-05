const { EmbedBuilder, Message, Client } = require('discord.js');
const schema = require('../../models/server/cc');

module.exports = {
    name: 'cc-list',
    description: "List the custom commands!",
    aliases: ['01100011011000110010110101101100011010010111001101110100'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const data  = await schema.find({ Guild: message.guild.id }).exec();
        if(!!data === false) return message.channel.send('There is no custom commands!');
        message.channel.send({ embeds: [
            new EmbedBuilder()
                .setColor('BLUE')
                .setDescription(
                    data.map((cmd, i) =>
                        `${i + 1}: ${cmd.Command}`
                    ).join('\n')
                )
        ]})
    }
}
