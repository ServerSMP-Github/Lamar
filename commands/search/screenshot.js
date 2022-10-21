const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');

module.exports = {
    name: 'screenshot',
    description: "Screenshot a website!",
    usage: "[ url ]",

    /**
    *
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args) => {
        const nsfwData = await SchemaNSFW.findOne({ Guild: message.guild.id });
        if (!nsfwData && !message.channel.nsfw) return message.reply("NSFW commands disabled on this guild.");

        message.channel.nsfw ? Screenshot() : nsfwData.Channels.length > 0 ? !nsfwData.Channels.includes(message.channel.id) ? message.reply("NSFW commands disabled on this channel.") : Screenshot() : Screenshot();

        async function Screenshot() {
            const requestedURL = args.join(" ");
            if (!args.length) return message.reply("Please specify a URL!");
            if (!isValidHttpUrl(requestedURL)) return message.reply("The url that you requested is not a valid url.");
            message.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Here is the website you requested!")
                    .setURL(requestedURL)
                    .setImage(encodeURI(`https://image.thum.io/get/width/1920/crop/675/noanimate/${requestedURL}`))
                    .setColor("Random")
                ]
            });
        }
    }
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}