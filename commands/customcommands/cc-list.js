const { EmbedBuilder, Message, Client } = require('discord.js');
const customSchema = require('../../models/server/cc');

module.exports = {
    name: 'cc-list',
    description: "List the custom commands!",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const customData = await customSchema.find({ Guild: message.guild.id }).exec();
        if (!customData) return message.channel.send('There is no custom commands!');

        message.channel.send({ embeds: [
            new EmbedBuilder()
            .setColor('Blue')
            .setDescription(
                customData.map((cmd, i) =>
                    `${i + 1}: ${cmd.Command}`
                ).join('\n')
            )
        ]});
    }
}
