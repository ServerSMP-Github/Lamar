const {
    Message,
    Client,
    MessageActionRow,
    MessageButton,
    EmbedBuilder,
    MessageAttachment
} = require("discord.js");

module.exports = {
    name: 'first-message',
    aliases: ['fmsg'],
    usage: '[ #channel or not ]',
    description: 'Get the first message in a channel',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.channel;
        
        const fetchmessages = await channel.messages.fetch({
            limit: 1,
            after: 1
        })
        const msg = fetchmessages.first();

        message.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`
                    **Message Content:** ${msg.content}
                    **Sent By:** ${msg.author}
                    **Date sent:** <t:${parseInt(msg.createdTimestamp / 1000)}:R>
                    **URL:** [Click Me](${msg.url})
                `)
                .setThumbnail(message.guild.iconURL({
                    dynamic: true
                }))
                .setColor("Random")
                .setTimestamp()
            ]
        })
    },
};