const SchemaModlogs = require('../models/logs/modlogs');
const { EmbedBuilder } = require('discord.js');
const Schema = require('../models/logs/boost');
const client = require('../index');

client.on('guildMemberBoost', (member) => {
  Schema.findOne({
    Guild: member.guild.id
  }, async (err, data) => {
    if (!data) return;
    client.channels.cache.get(data.Channel).send({
      embeds: [
        new EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag} just boosted ${member.guild.name}!`,
          iconURL: member.user.displayAvatarURL({
            format: 'png'
          })
        })
        .setImage(`https://frenchnoodles.xyz/api/endpoints/boostercard/?image=${member.user.displayAvatarURL({ format: 'png', size: 4096 })}`)
      ]
    });
  });

  SchemaModlogs.findOne({
    Guild: member.guild.id
  }, async (err, data) => {
    if (!data) return;
    client.channels.cache.get(data.Channel).send({
      embeds: [
        new EmbedBuilder()
        .setTitle('New Boost')
        .setDescription(`${member.user.tag} has boosted the server!`)
        .setColor('#00ff00')
        .setTimestamp()
      ]
    });
  });
});

client.on('guildMemberUnboost', (member) => {
  SchemaModlogs.findOne({
    Guild: member.guild.id
  }, async (err, data) => {
    if (!data) return;
    client.channels.cache.get(data.Channel).send({
      embeds: [
        new EmbedBuilder()
        .setTitle('Boost Removed')
        .setDescription(`${member.user.tag} has unboosted the server.`)
        .setColor('#ff0000')
        .setTimestamp()
      ]
    });
  });
});
