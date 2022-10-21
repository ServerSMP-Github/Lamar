const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "wikipedia",
    usage: "[serch]",
    description : "Serch stuff on wikipedia!",

    /** 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async(client, message, args) => {
        const query = args[0];
        if (!query) return message.reply("Please specify a query!");

        const response = (await axios(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(this.query)}`)).data;
        if (!response) return message.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`:x: | No results for ${query}`)
                .setColor('Red')
            ]
        });

        if (response.type === 'disambiguation') return message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(response.title)
                .setColor("Red")
                .setURL(response.content_urls.desktop.page)
                .setThumbnail(response.thumbnail.source)
                .setDescription(`${response.extract} Other Links for the same topic: [Click Me!](${response.content_urls.desktop.page}).`)
            ]
        });

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(response.title)
                .setColor("Red")
                .setURL(response.content_urls.desktop.page)
                .setThumbnail(response.thumbnail.source)
                .setDescription(response.extract)
            ]
        });
    }
}