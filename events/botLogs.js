const { WebhookClient, MessageEmbed } = require('discord.js');
const client = require('../index');

const hook = new WebhookClient({ url: client.config.channel.webhooks.guildlogs });

client.on('guildCreate', async(guild) => {

    const owner = await guild.fetchOwner();

    hook.send({
      embeds: [
        new MessageEmbed()
          .setColor("#39ff14")
          .setTitle('New Server')
          .addField('Name', `${guild.name}`, true)
          .addField('Guild ID', `${guild.id}`, true)
          .addField('Owner', `${owner.user.tag}`, true)
          .addField('Owner ID', `${owner.user.id}`, true)
          .addField('Users', `${guild.members.cache.size}`, true)
          .setFooter({ text: `Guilds: ${client.guilds.cache.size}` })
          .setThumbnail(guild.iconURL())
      ]
    })

})

client.on('guildDelete', async(guild) => {

    const owner = await guild.fetchOwner();

    hook.send({
      embeds: [
        new MessageEmbed()
          .setColor("#F72119")
          .setTitle('Server Left')
          .addField('Name', `${guild.name}`, true)
          .addField('Guild ID', `${guild.id}`, true)
          .addField('Owner', `${owner.user.tag}`, true)
          .addField('Owner ID', `${owner.user.id}`, true)
          .addField('Users', `${guild.members.cache.size}`, true)
          .setFooter({ text: `Guilds: ${client.guilds.cache.size}` })
          .setThumbnail(guild.iconURL())
      ]
    })

})
