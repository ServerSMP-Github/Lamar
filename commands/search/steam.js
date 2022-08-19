const { EmbedBuilder, Message, Client } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'steam',
    description: 'Searches Steam for games!',
    usage: '<Game Name>',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const query = args.join(" ");

        if (!query) return message.reply("Command Usage: `steam <Game Name>`");

        const search = (await axios.get('https://store.steampowered.com/api/storesearch', {
            params: {
                cc: 'us',
                l: 'en',
                term: query
            }
        })).data;

        if (!search.items.length) return message.channel.send(`No search results found for **${query}**!`);

        const { id, tiny_image } = search.items[0];

        const body = (await axios.get('https://store.steampowered.com/api/appdetails', {
            params: {
                appids: id
            }
        })).data;

        const { data } = body[id.toString()];
        const current = data.price_overview ? `$${data.price_overview.final / 100}` : 'Free';
        const original = data.price_overview ? `$${data.price_overview.initial / 100}` : 'Free';
        const price = current === original ? current : `~~${original}~~ ${current}`;
        const platforms = [];
        if (data.platforms) {
            if (data.platforms.windows) platforms.push('Windows');
            if (data.platforms.mac) platforms.push('Mac');
            if (data.platforms.linux) platforms.push('Linux');
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: 'Steam', iconURL: 'https://i.imgur.com/xxr2UBZ.png', url: 'http://store.steampowered.com/' })
            .setTitle(`__**${data.name}**__`)
            .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
            .setImage(tiny_image)
            .addFields([
                { name: '❯\u2000Price', value: `•\u2000 ${price}`, inline: true },
                { name: '❯\u2000Metascore', value: `•\u2000 ${data.metacritic ? data.metacritic.score : '???'}`, inline: true },
                { name: '❯\u2000Recommendations', value: `•\u2000 ${data.recommendations ? data.recommendations.total : '???'}`, inline: true },
                { name: '❯\u2000Platforms', value: `•\u2000 ${platforms.join(', ') || 'None'}`, inline: true },
                { name: '❯\u2000Release Date', value: `•\u2000 ${data.release_date ? data.release_date.date : '???'}`, inline: true },
                { name: '❯\u2000DLC Count', value: `•\u2000 ${data.dlc ? data.dlc.length : 0}`, inline: true },
                { name: '❯\u2000Price', value: `•\u2000 ${price}`, inline: true },
                { name: '❯\u2000Developers', value: `•\u2000 ${data.developers ? data.developers.join(', ') || '???' : '???'}`, inline: true },
                { name: '❯\u2000Publishers', value: `•\u2000 ${data.publishers ? data.publishers.join(', ') || '???' : '???'}`, inline: true }
            ])

        return message.channel.send({
            embeds: [embed]
        });
    }
}