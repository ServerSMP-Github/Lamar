const { Message, Client, MessageActionRow, MessageButton, EmbedBuilder, MessageAttachment } = require("discord.js");
const axios = require('axios');

module.exports = {
    name : 'meme',
    aliases : ['m'],
    description : "Show's a random meme from r/memes",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const content = (await axios.get('https://www.reddit.com/r/memes/random/.json')).data;

        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;

        const embed = new EmbedBuilder()
        embed.setTitle(`${memeTitle}`)
        embed.setURL(`${memeUrl}`)
        embed.setImage(memeImage)
        embed.setColor('RANDOM')
        embed.setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })
        message.channel.send({ embeds: [embed] });
    },
};