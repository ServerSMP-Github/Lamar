const { EmbedBuilder, Message, Client, version } = require('discord.js');
const { msToDurationString } = require("../../assets/api/time");
const ytdl = require('ytdl-core');
const os = require('os');

module.exports = {
  name: 'about',
  description : "Send detailed information about the client.",
  owner: true,

  /**
  * @param {Client} client
  * @param {Message} message
  * @param {String[]} args
  */
  run: async(client, message, args) => {
    if (!client.config.command.owner.about) return message.reply("This command is disabled!");

    const guilds = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(15);

    await message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}` })
        .setColor("#5400FF")
        .setDescription(`**Stats:**\n\`\`\`asciidoc\nUsers count         :: ${client.users.cache.size}\nChannels count      :: ${client.channels.cache.size}\nGuilds count        :: ${client.guilds.cache.size}\nJoin Date           :: ${client.user.createdAt.toLocaleDateString("en-us")}\nDiscord.js Version  :: ${version}\nNodejs Version      :: ${process.version}\nYTDL Version        :: ${ytdl.version}\nARCH                :: ${os.arch}\nPlatform            :: ${os.platform}\nCPU                 :: ${os.cpus().map(i => `${i.model}`)[0]}\nCPU Cores           :: ${os.cpus().length}\nFree/Used/Total RAM :: ${Math.round(os.freemem / 1024**2)} MB / ${Math.round((os.totalmem() - os.freemem) / 1024**2)} MB / ${Math.round(os.totalmem / 1024**2)} MB\nProcess Memory      :: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB\nShards              :: ${message.client.ws.shards.size}\nPing                :: ${message.client.ws.ping}ms\nOS Uptime           :: ${msToDurationString(os.uptime() * 1000)}\nProcess Uptime      :: ${msToDurationString(process.uptime() * 1000)}\nBot Uptime          :: ${msToDurationString(client.uptime)}\nSource Code         :: https://github.com/ServerSMP-Github/BOT\n\`\`\`\n**Server Stats:**\n\`\`\`asciidoc\n${guilds.map((guild, index) => `${index+1} :: ${guild.name}: ${guild.memberCount} members`).join('\n')}\n\`\`\``)
      ]
    });
  }
}
