const { EmbedBuilder, Message, Client } = require('discord.js');
const schema = require('../../models/server/cc');

module.exports = {
    name: 'cc-list',
    description: "List the custom commands!",
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
                .setColor('Blue')
                .setDescription(
                    data.map((cmd, i) =>
                        `${i + 1}: ${cmd.Command}`
                    ).join('\n')
                )
        ]})
    }
}
