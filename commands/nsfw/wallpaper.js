const { MessageEmbed, Message, Client } = require('discord.js');
const db = require('quick.db');
const NSFW = require("discord-nsfw");
const nsfw = new NSFW();

module.exports = {
    name: 'wallpaper',
    category : 'nsfw',
    usage: '',
    description : "A anime wallpaper (Has a chance to show NSFW).",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if(db.has(`nsfw-${message.guild.id}`)=== false) return message.reply("NSFW commands disabled on this guild.");
            if(await client.mongo_quick.get(`nsfw-ch-${message.guild.id}`) !== "xxxxxxxxxxxxxxxxxxxx") {
                if (message.channel.id === await client.mongo_quick.get(`nsfw-ch-${message.guild.id}`)) {
        const image = await nsfw.wallpaper();
        const embed = new MessageEmbed()
            .setTitle(`Wallpaper`)
            .setColor("GREEN")
            .setImage(image);
        message.channel.send(embed);
      } else {
        return message.reply(`<#${await client.mongo_quick.get(`nsfw-ch-${message.guild.id}`)}> Is the NSFW channel!`);
      }
            } else {
        const image = await nsfw.wallpaper();
        const embed = new MessageEmbed()
            .setTitle(`Wallpaper`)
            .setColor("GREEN")
            .setImage(image);
        message.channel.send(embed);
            }
    }
}
