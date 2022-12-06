const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');

module.exports = {
    name: 'lewd',
    description : "A lewd image.",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const nsfwData = await SchemaNSFW.findOne({ Guild: message.guild.id });
        if (!nsfwData && !message.channel.nsfw) return message.reply("NSFW commands disabled on this guild.");

        message.channel.nsfw ? NSFW() : nsfwData.Channels.length > 0 ? !nsfwData.Channels.includes(message.channel.id) ? message.reply("NSFW commands disabled on this channel.") : NSFW() : NSFW();

        async function NSFW() {
            const data = await (await fetch(`https://nekos.life/api/v2/img/lewd`)).json();
            if (!data.url) return NSFW();
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Lewd Image`)
                    .setColor("Green")
                    .setImage(data.url)
                ]
            });
        }
    }
}
