const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');
const axios = require("axios");

module.exports = {
    name: 'lewd',
    description : "A lewd image.",
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
            const data = (await axios.get(`https://nekos.life/api/v2/img/lewd`)).data;
            if (!data.url) return NSFW();
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Lewd Image`)
                    .setColor("GREEN")
                    .setImage(data.url)
                ]
            });
        }
    }
}
