const { MessageEmbed, Message, Client } = require('discord.js');
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
        SchemaNSFW.findOne({ Guild: message.guild.id }, async(err, data) => {
            if (!data && !message.channel.nsfw) return message.reply("NSFW commands disabled on this guild.");
            if (message.channel.nsfw) return NSFW();
            if (data) {
                if (data.Channels.length > 0) {
                    if (!data.Channels.includes(message.channel.id)) return message.reply("NSFW commands disabled on this channel.");
                    else return NSFW();
                } else return NSFW();
            }
        });
        async function NSFW() {
            const data = (await axios.get(`http://api.oboobs.ru/boobs/${[Math.floor(Math.random() * 10930)]}`)).data;
            const preview = data[0]["PREVIEW".toLowerCase()];
            const image = `http://media.oboobs.ru/${preview}`;
            if (!preview) return NSFW();
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`Boobs Image`)
                    .setColor("GREEN")
                    .setImage(image)
                ]
            });
        }
    }
}
