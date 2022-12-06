const { EmbedBuilder, Message, Client } = require('discord.js');
const SchemaNSFW = require('../../models/server/nsfw');

module.exports = {
    name: 'hentai',
    aliases : ['h'],
    description : "Show's a random hentai from r/hentai.",
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
            const content = await (await fetch('https://www.reddit.com/r/hentai/random/.json')).json();

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
            embed.setColor('Random')
            embed.setFooter({ text: `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}` })
            message.channel.send({ embeds: [embed] });
        }
    }
}
