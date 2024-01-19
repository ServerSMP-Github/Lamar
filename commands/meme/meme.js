const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'meme',
    aliases : ['m'],
    description : "Display a random meme from r/memes.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const content = await (await fetch('https://www.reddit.com/r/memes/random/.json')).json();

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle(content[0].data.children[0].data.title)
                .setURL(`https://reddit.com${content[0].data.children[0].data.permalink}`)
                .setImage(content[0].data.children[0].data.url)
                .setColor('Random')
                .setFooter({ text: `👍 ${content[0].data.children[0].data.ups} 👎 ${content[0].data.children[0].data.downs} 💬 ${content[0].data.children[0].data.num_comments}` })        
            ]
        });
    },
};