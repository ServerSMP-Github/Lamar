const { Message, Client, Util, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'steal',
    usage: '[emoji] [emoji] [emoji] [emoji] [emoji]',
    description : "Acquire emojis from other servers and add them to your own.",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!args.length) return message.reply("Please specify some emoji!");

        for (const rawEmoji of args) {
            const parsedEmoji = Util.parseEmoji(rawEmoji);

            if (!parsedEmoji.id) return;

            const extension = parsedEmoji.animated ? ".gif" : ".png";
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;

            const emoji = await message.guild.emojis.create(url, parsedEmoji.name);

            message.channel.send(`Added: \`${emoji.url}\``)
        }
    }
}