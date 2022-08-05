const { Message, Client, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require("axios");

module.exports = {
    name: 'reddit',
    usage: '[ subreddit name ]',
    description : "Get info on a subreddit!",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const input = args.join(" ");
        if(!input) return message.channel.send("Please provide a subreddit name!");

        const response = (await fetch(`https://api.popcat.xyz/subreddit/${encodeURIComponent(input)}`)).data;

        if (response.error) return message.channel.send("Subreddit Not Found!");

        const yesno = {
            true: "Yes",
            false: "No"
        }

        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setTitle("Subreddit Info")
                .setThumbnail(response.icon.split("?")[0])
                .setColor("FF5700")
                .addField("Name", response.name, true)
                .addField("Title", response.title, true)
                .addField("URL", `[URL](${response.url})`, true)
                .addField("Active Users", response.active_users, true)
                .addField("Total Users", response.members, true)
                .addField("Images Allowed", yesno[response.allow_images], true)
                .addField("Videos Allowed", yesno[response.allow_videos], true)
                .addField("Over 18", yesno[response.over_18], true)
                .addField("Description", response.description ? response.description : "None")
            ]
        })
    }
}
