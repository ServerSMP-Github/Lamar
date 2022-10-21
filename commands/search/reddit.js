const { Message, Client, EmbedBuilder } = require('discord.js');
const fetch = require("axios");

module.exports = {
    name: "reddit",
    usage: "[ subreddit name ]",
    description : "Get info on a subreddit!",

    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async(client, message, args) => {
        const input = args.join(" ");
        if (!input) return message.channel.send("Please provide a subreddit name!");

        const response = (await fetch(`https://api.popcat.xyz/subreddit/${encodeURIComponent(input)}`)).data;
        if (response.error) return message.channel.send("Subreddit Not Found!");

        const yesno = {
            true: "Yes",
            false: "No"
        }

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Subreddit Info")
                .setThumbnail(response.icon.split("?")[0])
                .setColor("#FF5700")
                .addFields([
                    { name: "Name", value: response.name, inline: true },
                    { name: "Title", value: response.title, inline: true },
                    { name: "URL", value: `[URL](${response.url})`, inline: true },
                    { name: "Active Users", value: response.active_users, inline: true },
                    { name: "Total Users", value: response.members, inline: true },
                    { name: "Images Allowed", value: yesno[response.allow_images], inline: true },
                    { name: "Videos Allowed", value: yesno[response.allow_videos], inline: true },
                    { name: "Over 18", value: yesno[response.over_18], inline: true },
                    { name: "Description", value: response.description ? response.description : "None" },
                ])
            ]
        });
    }
}
