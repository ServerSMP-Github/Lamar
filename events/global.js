const { EmbedBuilder } = require('discord.js');
const Schema = require('../models/server/global');
const client = require("../index");

client.on("messageCreate", async (message) => {
    if(message.author.bot) return;
    Schema.findOne({ Channel: message.channel.id, Activated: true }, async(err, data) => {
        if(data) {
            Schema.find({ Activated: true }, async(err, data) => {
                data.map(({ Channel }) => {
                    if(Channel === message.channel.id) return;
                    client.channels.cache.get(Channel).send({ embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(message.content)
                            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setColor("Random")
                            .setTimestamp()
                    ]});
                });
            });
        }
    });
});
