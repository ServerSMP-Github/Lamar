const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');
const axios = require("axios");

module.exports = {
    name: 'boobs',
    description : "Image of boobs.",
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
            const data = (await axios.get(`http://api.oboobs.ru/boobs/${[Math.floor(Math.random() * 10930)]}`)).data;
            const preview = data[0]["PREVIEW".toLowerCase()];
            const image = `http://media.oboobs.ru/${preview}`;
            if (!preview) return NSFW();
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Boobs Image`)
                    .setColor("Green")
                    .setImage(image)
                ]
            });
        }
    }
}
