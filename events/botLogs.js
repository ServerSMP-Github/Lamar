const { WebhookClient, EmbedBuilder, Events } = require('discord.js');
const client = require('../index');

const hook = new WebhookClient({ url: client.config.channel.webhooks.guildlogs });

client.on(Events.GuildCreate, async(guild) => {

    const owner = await guild.fetchOwner();

    hook.send({
      embeds: [
        new EmbedBuilder()
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

client.on(Events.GuildDelete, async(guild) => {

    const owner = await guild.fetchOwner();

    hook.send({
      embeds: [
        new EmbedBuilder()
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
