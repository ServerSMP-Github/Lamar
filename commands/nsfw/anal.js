const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');

module.exports = {
    name: 'anal',
    description: "Image of anal sex.",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const nsfwData = await SchemaNSFW.findOne({ Guild: message.guild.id });
        if (!nsfwData && !message.channel.nsfw) return message.reply("NSFW commands disabled on this guild.");

        message.channel.nsfw ? NSFW() : nsfwData.Channels.length > 0 ? !nsfwData.Channels.includes(message.channel.id) ? message.reply("NSFW commands disabled on this channel.") : NSFW() : NSFW();

        async function NSFW() {
            const data = await (await fetch(`https://nekobot.xyz/api/image?type=anal`)).json();
            if (!data.message) return NSFW();
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Anal Image`)
                    .setColor("Green")
                    .setImage(data.message)
                ]
            });
        }
    }
}