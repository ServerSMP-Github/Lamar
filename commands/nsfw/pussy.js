const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');
const axios = require("axios");

module.exports = {
    name: 'pussy',
    description : "Image of pussy.",
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
            const data = (await axios.get(`https://nekobot.xyz/api/image?type=pussy`)).data;
            if (!data.message) return NSFW();
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Pussy Image`)
                    .setColor("Green")
                    .setImage(data.message)
                ]
            });
        }
    }
}
